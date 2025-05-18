import {
    useWebApp,
    useWebAppCloudStorage,
    useWebAppPopup,
    useWebAppRequests,
    useWebAppBiometricManager
} from 'vue-tg'

export const useTgWebAppStore = defineStore('tgWebAppStore', {
    state: () => ({
        webAppData: null,
        dataUnsafe: null,
        contactData: null
    }),

    actions: {
        // Инициализация
        init() {
            return new Promise(async (resolve, reject) => {
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {  // Проверка, только если на клиенте
                    this.webAppData = useWebApp()

                    if (this.webAppData.version > '6.0') {
                        try {
                            this.dataUnsafe = await this.initDataUnsafe()
                            this.contactData = await this.initContactData()
                        } catch (error) {
                            reject(error)
                            return
                        }
                    }

                    resolve(true)
                } else {
                    reject('Ошибка: клиентская среда не доступна')
                }
            })
        },

        // Инициализация данных из облачного хранилища
        async initDataUnsafe() {
            return new Promise(async (resolve, reject) => {
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {  // Проверка на клиенте
                    try {
                        let dataUnsafe = null
                        const data = await useWebAppCloudStorage().getStorageItem('initDataUnsafe')
                        if (typeof data === "string" && data === '') {
                            dataUnsafe = useWebApp().initDataUnsafe
                            await useWebAppCloudStorage().setStorageItem('initDataUnsafe', JSON.stringify(dataUnsafe))
                        } else {
                            dataUnsafe = JSON.parse(data)
                        }
                        resolve(dataUnsafe)
                    } catch (error) {
                        reject('Ошибка при инициализации данных')
                    }
                } else {
                    reject('Ошибка: клиентская среда не доступна')
                }
            })
        },

        // Инициализация контактных данных
        async initContactData() {
            return new Promise(async (resolve, reject) => {
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {  // Проверка на клиенте
                    try {
                        let contactData = null
                        const data = await useWebAppCloudStorage().getStorageItem('contactData')

                        if (typeof data === "string" && data === '') {
                            useWebAppRequests().requestContact((ok, response) => {
                                if (ok) {
                                    contactData = {
                                        first_name: response.responseUnsafe.contact.first_name,
                                        last_name: response.responseUnsafe.contact.last_name,
                                        phone_number: response.responseUnsafe.contact.phone_number.slice(1, 5) + '****',
                                        user_id: response.responseUnsafe.contact.user_id,
                                        unsafe: response.response
                                    }
                                    useWebAppCloudStorage().setStorageItem('contactData', JSON.stringify(contactData))
                                } else {
                                    useWebAppPopup().showAlert('Контакт не получен')
                                }
                            })
                        } else {
                            contactData = JSON.parse(data)
                        }

                        resolve(contactData)
                    } catch (error) {
                        reject('Ошибка при получении контактных данных')
                    }
                } else {
                    reject('Ошибка: клиентская среда не доступна')
                }
            })
        },

        // Аутентификация через биометрию
        async authenticateBiometric() {
            return new Promise(async (resolve, reject) => {
                if (typeof window !== 'undefined' && window.Telegram?.WebApp && this.webAppData.version > '7.2') {  // Проверка на клиенте
                    useWebAppBiometricManager().initBiometric(() => {
                        const biometricSettings = useWebAppBiometricManager().openBiometricSettings()
                        if (biometricSettings.isBiometricAvailable) {
                            useWebAppBiometricManager().authenticateBiometric('Это нужно, чтобы подтвердить Ваш заказ', (ok, token) => {
                                if (ok) {
                                    if (!token.length) {
                                        token = Math.random().toString(36).substring(2, 15)

                                        useWebAppBiometricManager().updateBiometricToken(token, () => {
                                            resolve({
                                                ok: true,
                                                token: token,
                                                deviceId: biometricSettings.deviceId,
                                                message: 'Мы верифицировали Ваш заказ',
                                            })
                                        })
                                    } else {
                                        resolve({
                                            ok: true,
                                            token,
                                            deviceId: biometricSettings.deviceId,
                                            message: 'Мы верифицировали Ваш заказ',
                                        })
                                    }
                                } else {
                                    resolve({
                                        token,
                                        ok: false,
                                        message: 'Мы не смогли верифицировать Ваш заказ',
                                    })
                                }
                            })
                        } else {
                            resolve({
                                ok: false,
                                message: 'Мы не смогли верифицировать Ваш заказ',
                            })
                        }
                    })
                } else {
                    resolve({
                        ok: true
                    })
                }
            })
        }
    }
})
