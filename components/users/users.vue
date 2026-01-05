<script setup lang="ts">
const activeGroup = ref('all')
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
const telegramName = useState<string | null>('userName')
const userId = useState('telegramUser')
const userRole = useState('userRole').value.role
const { data: org_participants, isLoading, refetch } = useQuery({
    queryKey: computed(() => ['org_participants', userId.value, activeGroup.value]),
    queryFn: async () => {
        const res = await $fetch('/api/get_org_participants', {
            query: { telegram_id: userId.value, filter: activeGroup.value }

        })
        return res
    },
    enabled: computed(() => Boolean(userId)),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
})
const { $queryClient } = useNuxtApp()
const { mutate: patchRole } = useMutation({
    mutationFn: (payload: { role: string; participant_id: number }) =>

        $fetch('/api/patch_participant_role', {
            method: 'PATCH',
            query: {
                telegram_id: userId.value,
                participant_id: payload.participant_id,
                role: payload.role,
            },
        }


        ),
    onSuccess: (data) => {
        // обновляем кэш, без refetch
        $queryClient.invalidateQueries(['org_participants', userId.value, activeGroup.value])
    }

})
const { mutate: deleteParticipant } = useMutation({
    mutationFn: (id: number) =>

        $fetch('/api/patch_participant_role', {
            method: 'PATCH',
            query: {
                telegram_id: userId.value,
                participant_id: id,
                role: 'remote',
            },
        }


        ),
    onSuccess: (data) => {
        // обновляем кэш, без refetch
        $queryClient.invalidateQueries(['org_participants', userId.value, activeGroup.value])
    }

})
const { mutate: addParticipantFn } = useMutation({
    mutationFn: (payload: { role: string; participant_username: string }) =>

        $fetch('/api/post_add_participant_to_org', {
            method: 'POST',
            query: {
                telegram_id: userId.value,
                participant_username: payload.participant_username,
                role: payload.role,
            },
        }


        ),
    onSuccess: (data) => {
        // обновляем кэш, без refetch
        $queryClient.invalidateQueries(['org_participants', userId.value])
        selectedText.value = 'leader'
         nameToAdd.value = ''

    },
    onError: (error: any) => {


  if ( error?.statusCode === 404) {
    window.Telegram.WebApp.showAlert(
      'Этот пользователь уже состоит в вашей организации'
    )
    
  }
  if (error?.statusCode === 409) {
    const inviteLink = `https://t.me/ClikInteractive_Bot?start=${userId.value}_${selectedText.value}`

    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        // показываем alert с текстом
        window.Telegram.WebApp.showAlert(
          `Пользователь не найден. Ссылка для приглашения уже скопирована в буфер:\n${inviteLink}`
        )
      })
      .catch(() => {
        window.Telegram.WebApp.showAlert(
          `Пользователь не найден. Не удалось скопировать ссылку, вот она:\n${inviteLink}`
        )
      })
    
  }
selectedText.value = 'leader'
         nameToAdd.value = ''
  return
}


})
let groups = {
    "all": 'Все',
    "admin": "Администраторы",
    "leader": "Ведущие",
}
const roles = {
    "admin": "Администратор",
    "leader": "Ведущий",
    "organizer": "Создатель организации"
}

const isOpen = ref(false)
const current_id = ref(0)
function toggleItemDropdown(id) {
    if (current_id.value === id) {
        current_id.value = undefined
    } else {
        current_id.value = id
    }
}
function getDropdownIcon(id) {
    return current_id.value === id
        ? "../images/users/close_role.svg"
        : "../images/users/open_role.svg";
}
const canChangeRole = (participantRole: string, yourRole: string, isYou: boolean) => {
    if (isYou) return false // с самим собой нельзя действия производить
    if (yourRole === 'organizer') {
        // если вы орг, то вы можете удалять кого угодно и менять роль кому угодно
        return true
    }
    else if (yourRole === 'admin') {
        if (participantRole === 'organizer') return false;
        if (participantRole === 'leader') return true; // если вы админ то вы можете поменять роль только ведущему и только на админа
        if (participantRole === 'admin') return false;
    }
    else return false; // если вы не админ и не орг то никакие действия не можете выполнять
}
const deleteId = ref(0)
const showDeletePop = ref(false)
const currentName = ref('')

async function showDelete(currName: string, id: number) {
    current_id.value = undefined
    showDeletePop.value = true
    currentName.value = currName
    deleteId.value = id
}
async function hidePopup() {
    showDeletePop.value = false
    currentName.value = ''
    deleteId.value = 0
}
async function deleteParticipants() {
    deleteParticipant(deleteId.value)
    showDeletePop.value = false
    currentName.value = ''
    deleteId.value = 0
}
const changeRoleUserId = ref<number>(0)
const tochangeRole = ref('')
const showChangeRole = ref(false)
async function showChange(role: string, currName: string, id: number) {
    showChangeRole.value = true
    tochangeRole.value = role
    currentName.value = currName
    changeRoleUserId.value = id
    current_id.value = 0
}
async function hidePopupChange() {
    showChangeRole.value = false
    tochangeRole.value = ''
    currentName.value = ''
    changeRoleUserId.value = 0
}
async function ChangeRole() {
    patchRole({
        role: tochangeRole.value,
        participant_id: changeRoleUserId.value
    })
    showChangeRole.value = false
    tochangeRole.value = ''
    currentName.value = ''
    changeRoleUserId.value = 0
}


const showAddPop = ref(false)
function toggleDropdown() {
    isOpen.value = !isOpen.value
}
const options_code = {
    "leader": "Ведущий",
    "admin": "Администратор",
}
const selectedText = ref('leader')
async function selectOption(option: string) {
    selectedText.value = option
    isOpen.value = false
}
async function addParticipant() {
    if (nameToAdd.value.length < 2) {
        window.Telegram.WebApp.showAlert(`Заполните поле с username!`);
        return;
    }
    addParticipantFn({ role: selectedText.value, participant_username: nameToAdd.value })
    
}
function onAddClick() {
  if (userRole === 'leader') return
  showAddPop.value = true
}
const nameToAdd = ref('')
</script>
<template>
    <layout :active_nav="'users'">
        <div class='users_title'>
            Пользователи
        </div>
        <form class="users_form">
            <div class="users_form_finder_finder">
                <img src="/public/images/history/finder.svg" class="users_form_input-icon" />

                <input type="text" placeholder="Поиск интерактива" class="users_form_search-input" maxlength="32" />
            </div>
            <div class="users_form_button" @click="onAddClick()" v-if ="userRole !== 'leader'">
                <div>
                    Добавить
                </div>
                <img src="/public//images/users/add.svg"></img>

            </div>
        </form>
        <div class="users_list">
            <div class="users_list_groups">
                <div v-for="(value, key) in groups" @click="activeGroup = key; current_id = undefined" class="group">
                    <div v-if="activeGroup == key" class="group_active"></div>
                    <div class="group_value" :style="{ fontWeight: activeGroup === key ? 600 : 400 }">{{ value }}</div>
                </div>
            </div>
            <div class='users_list_list_column'>

                <div class="users_list_list">
                    <div class="users_list_list_header" style="color: #853CFF;">
                        <span class='users_list_list_name'>
                            Имя
                        </span>
                        <span class="users_list_list_role">
                            Роль
                        </span>

                    </div>
                    <div class="users_list_list_line"></div>
                </div>
                <div class="users_list_list_list" v-for="user in org_participants?.participants" :key="user.id">
                    <div class="users_list_list_header">
                        <div style="display: grid;">
                            <span class='users_list_list_name'>
                            {{ user.name }}
                        </span>
                          <span >
                            @{{ user.username }}
                            </span>
                        </div>
                        
                        <div :class="{ users_list_list_role: user.role !== 'organizer' }">


                            <div style="display: flex; align-items: center  ;"
                                @click=" canChangeRole(user.role, userRole, user.is_you) && toggleItemDropdown(user.id)"
                                :style="{ cursor: canChangeRole(user.role, userRole, user.is_you) ? 'pointer' : 'default' }">


                                <div style="color:#7D7D7D;"
                                    :class="{ users_list_list_role_margin: user.role !== 'organizer' }">
                                    {{ roles[user.role] }}
                                </div>

                                <img class="open_role" v-if="canChangeRole(user.role, userRole, user.is_you)"
                                    :src="getDropdownIcon(user.id)" />
                            </div>
                            <div class="users_list_item-dropdown-options"
                                v-if="current_id === user.id && canChangeRole(user.role, userRole, user.is_you)"
                                style=" z-index: 10001 !important;">
                                <div class="users_list_item-dropdown-option" :class="{ option_margin: true }"
                                    @click="user.role !== 'admin' && showChange('admin', user.name, user.id)">
                                    <span>Выдать роль “Администратор”</span>
                                </div>
                                <div class="users_list_item-dropdown-option" :class="{ option_second_margin: true }"
                                    @click="user.role !== 'leader' && showChange('leader', user.name, user.id)">
                                    <span>Выдать роль “Ведущий”</span>
                                </div>
                            </div>
                        </div>
                        <img class="kick_user" src="/public/images/users/kick_user.svg"
                            v-if="canChangeRole(user.role, userRole, user.is_you)"
                            @click="  showDelete(user.name, user.id)" />

                    </div>
                    <div class="users_list_list_line"></div>

                </div>
            </div>
        </div>
        <div v-if="showDeletePop" class="users_popup-overlay">
            <div class="users_popup-content">
                <div class="users_popup-text">Вы уверены, что хотите удалить пользователя<br /><span
                        style="color: #853CFF;">{{ currentName }}</span>?</div>
                <div class="users_popup-text_">Это действие отменить будет невозможно. </div>
                <div class="users_popup-buttons">
                    <button class="users_popup-btn cancel delete" @click="hidePopup()">Отменить</button>
                    <button class="users_popup-btn confirm delete" @click="deleteParticipants()">Удалить</button>

                </div>
            </div>

        </div>
        <div v-if="showChangeRole" class="users_popup-overlay">
            <div class="users_change_popup-content" :class="{ height: true }">
                <div class="users_popup-text" :class="{ margin_text: true }">Вы уверены, что хотите выдать роль
                    “{{ tochangeRole === 'leader' ? "Ведущий" : "Администратор" }}” пользователю <span
                        style="color: #853CFF;">{{ currentName }}</span>? </div>
                <div class="users_popup-buttons" :class="{ margin: true }">
                    <button class="users_popup-btn cancel" @click="hidePopupChange()">Отменить</button>
                    <button class="users_popup-btn confirm" style="display: flex;
      align-items: center;
      justify-content: center;" :class="{ margin_left: true }" @click="ChangeRole()">Выдать</button>

                </div>
            </div>
        </div>
        <div v-if='showAddPop' class="users_popup-overlay">

            <div class="add_popup-content">
                <img src="/images/history/Vector_1.svg" class="add_popup-close"
                    @click="showAddPop = false; isOpen = false; selectedText = 'leader'" />
                <div class="add_popup-text">Добавление пользователя в организацию</div>
                <form class="add_form">
                    <textarea placeholder="Введите  username в telegram: @ffadff " maxlength="32" v-model="nameToAdd" />
                    <div class="add_custom-dropdown" @click="toggleDropdown">
                        <div class="add_custom-dropdown-selected">{{ options_code[selectedText] }}</div>
                        <div class="add_custom-arrow" :class="{ open: isOpen }">
                            <img src="/public/images/interactives/open.svg" v-if="isOpen" />
                            <img src="/public/images/interactives/close.svg" v-if="!isOpen" />
                        </div>
                    </div>
                    <div class="add_custom-dropdown-options" v-if="isOpen">
                        <div class="add_custom-dropdown-option-list">
                            <div class="add_custom-dropdown-option" v-for="(label, value) in options_code" :key="value"
                                @click="selectOption(value)">
                                <img class="add_custom-dropdown-circle" src="/public/images/interactives/picked.svg"
                                    v-if="selectedText === value" />
                                <img class="add_custom-dropdown-circle" src="/public/images/interactives/Ellipse.svg"
                                    v-else />
                                <div class="add_custom-dropdown-text">{{ label }}</div>
                            </div>
                        </div>
                    </div>

                </form>
                <button class="add_popup-btn" @click="addParticipant">Добавить</button>
            </div>
        </div>
    </layout>
</template>
<style>
@media (max-width:1918px),
(max-height:1078px) {
    .option_margin {
        margin-top: calc((17 / 832) * 100dvh) !important;
    }

    .option_second_margin {
        margin-top: calc((4 / 832) * 100dvh) !important;
    }

    .users_title {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
        margin-top: calc((25 / 832) * 100dvh);
    }

    .users_form {
        margin-top: calc((20 / 832) * 100dvh);
        display: flex;

    }

    .users_list {
        margin-top: calc((12 / 832) * 100dvh);
        display: grid;
        grid-template-columns: calc(231/1280*100dvw) calc(805/1280*100dvw);
        gap: calc(20/1280*100dvw)
    }

    .users_list_groups {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        width: calc(231 / 1280 * 100dvw);
        height: calc((107 / 832) * 100dvh) !important;
        padding-left: calc(10 / 1280 * 100dvw);
        padding-top: calc((15 / 832) * 100dvh);
        border: calc(1.5/832*100dvh)solid #E0E0E0;
        border-radius: calc(8/832*100dvh);
    }

    .users_list_groups>div {
        height: calc((19 / 832) * 100dvh);
        margin-bottom: calc((10 / 832) * 100dvh);
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .group {
        position: relative;
    }

    .group_value {
        margin-left: calc(10 / 1280 * 100dvw);
    }

    .group_active {
        position: absolute;
        height: 100%;
        background-color: #853CFF;
        width: calc(2/1280*100dvw);
        border-radius: calc(2/832*100dvh);
    }


    .users_list_list {
        margin-top: calc((23 / 832) * 100dvh);
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);

    }

    .users_list_list_list {
        color: #1D1D1D !important;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    }

    .users_list_list_header {
        margin-left: calc(18/1280*100dvw);
        display: flex;
        align-items: center;
        height: calc((46.13 / 832) * 100dvh) !important;
    }

    .users_list_list_header>div {
        position: relative;
        display: flex;
        align-items: center;
    }

    .users_list_list_name {
        width: calc(473/1280*100dvw);
    }

    .users_list_list_role {
        width: calc(146/1280*100dvw) !important;
    }

    .open_role {
        margin-left: calc(10/1280*100dvw);
        width: calc(16 / 1280 * 100dvw);
        height: calc((9 / 832) * 100dvh);
    }

    .kick_user {
        margin-left: calc(110/1280*100dvw);
        width: calc(24 / 1280 * 100dvw);
        height: calc((24 / 832) * 100dvh);
        cursor: pointer;
    }

    .users_list_list_role_margin {
        display: flex;
        width: calc(120/1280*100dvw) !important;
    }

    .users_list_list_line {
        background-color: #e9e9e9 !important;
        height: calc((1 / 832) * 100dvh) !important;
    }

    .users_form_finder_header {

        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        color: #1D1D1D;
    }

    .users_form_finder_finder {
        position: relative;
        display: flex;
        align-items: center;
    }

    .users_form_search-input {
        width: calc(231 / 1280 * 100dvw);
        height: calc((39 / 832) * 100dvh);
        line-height: calc((39 / 832) * 100dvh);
        color: #1D1D1D !important;
        border: calc((1.5 / 832) * 100dvh) solid #E0E0E0;
        border-radius: calc((8 / 832)*100dvh);
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        display: flex;
        align-items: center;
        padding-left: calc((50 / 1280) * 100dvw);
        box-sizing: border-box;
    }

    .users_form_search-input::placeholder {
        line-height: calc((39 / 832) * 100dvh);
        display: flex;
        align-items: center;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        color: #A9A9A9;
    }

    .users_form_input-icon {
        position: absolute;
        left: calc((17 / 1280) * 100dvw);
        top: 50%;
        transform: translateY(-50%);
        width: calc((19/1280) * 100dvw);
        height: calc((19/1280) * 100dvw);
        pointer-events: none;
    }

    .users_form_button {
        box-sizing: border-box;
        width: calc((157/1280) * 100dvw) !important;
        height: calc((39/832) * 100dvh);
        background-color: #6AB23D;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: calc((10/1280) * 100dvw);
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);

    }

    .users_form_button {
        margin-left: calc(20/1280*100dvw);
        border-radius: calc((5 / 832)*100dvh);
        cursor: pointer;
    }

    .users_form_button>div {}

    .users_form_button>img {
        width: calc((19/1280) * 100dvw);
        height: calc((19/832) * 100dvh);
    }

    .users_list_item-dropdown-options {
        position: absolute;
        top: calc(100% + calc(11/832)*100dvh);
        box-shadow: 0px 1px 13.8px 0px #00000025;
        width: calc((310 / 1280) * 100dvw);
        height: calc((106 / 832) * 100dvh);
        border-radius: calc((14/832*100dvh));
        left: calc((-14 / 1280) * 100dvw);
        background: white;
        z-index: 665455;

    }

    .users_list_item-dropdown-option {
        margin: 0 auto;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        color: #1D1D1D;
        white-space: nowrap;
        font-weight: 400;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
        width: calc((298/1280) * 100dvw);
        height: calc((34 / 832) * 100dvh);
        padding-left: calc((8/1280) * 100dvw);

    }

    .users_list_item-dropdown-option:hover {
        border-radius: calc(7/832*100dvh);
        background-color: #DFDFDF !important;
    }

    .users_popup-overlay {
        font-family: "Lato", sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #00000052;
        display: flex;
        justify-content: center;
        z-index: 1000;

    }

    .users_popup-content {
        margin-top: calc((273/832)*100dvh);
        background: white;
        width: calc((524 / 1280) * 100dvw);
        height: calc((233 / 832) * 100dvh);
        border-radius: calc((18/832)*100dvh);
        box-sizing: border-box;


    }

    .users_change_popup-content {
        margin-top: calc((290/832)*100dvh);
        background: white;
        width: calc((524 / 1280) * 100dvw);
        height: calc((173 / 832) * 100dvh);
        border-radius: calc((18/832)*100dvh);
        box-sizing: border-box;
    }

    .height {
        height: calc((173 / 832) * 100dvh) !important;
    }

    .margin {
        margin-top: calc((18/832)*100dvh) !important;
        margin-left: calc((203/1280)*100dvw) !important;
    }

    .margin_text {
        height: calc((64 / 832) * 100dvh) !important;
    }

    .margin_left {
        width: calc((150 / 1280) * 100dvw) !important;
    }

    .users_popup-text {
        margin-top: calc((24/832)*100dvh) !important;
        margin-left: calc((20/1280)*100dvw) !important;
        font-family: "Lato", sans-serif;
        font-weight: 700;
        font-style: Bold;
        font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
        letter-spacing: clamp(0.20px, calc((20 /100/ 1280) * 100dvw), 0.4px);
        ;
        line-height: calc((32/832)*100dvh);
    }

    .users_popup-text_ {
        margin-top: calc((10/832)*100dvh) !important;
        margin-left: calc((20/1280)*100dvw) !important;
        line-height: calc((19.2 / 1280) * 100dvw);

        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
        color: #7D7D7D;
        letter-spacing: clamp(0.10px, calc((16 /100/ 1280) * 100dvw), 0.32px);
        ;
        vertical-align: middle;
    }

    .users_popup-buttons {
        display: flex;

        margin-top: calc((56/832)*100dvh);
        margin-left: calc((218 / 1280) * 100dvw);

    }

    .users_popup-btn.confirm {
        margin-left: calc((10 / 1280) * 100dvw);
    }

    .users_popup-btn {
        width: calc((138 / 1280) * 100dvw);
        height: calc((41/832)*100dvh);
        font-size: clamp(20px, calc((20 / 1280) * 100dvw), 40px);
        font-family: "Lato", sans-serif;
        border-radius: calc((8/832)*100dvh);
        cursor: pointer;
    }

    .users_popup-btn.confirm {
        background-color: #6ab23d;
        border: calc((1.5/832)*100dvh) solid #6ab23d;
        color: white;
    }

    .users_popup-btn.confirm:hover {
        background-color: #559130;
        border: calc((1.5/832)*100dvh) solid #559130;
    }

    .users_popup-btn.cancel {
        background-color: #FFFFFF;
        border: calc((1.5/832)*100dvh) solid #853CFF;
        color: #853CFF;
    }

    .users_popup-btn.cancel:hover {
        color: #FFFFFF;
        background-color: #AA77FF;
    }

    .users_popup-btn.cancel.delete {
        background-color: #FFFFFF;
        border: none;
        color: #7D7D7D;
    }

    .users_popup-btn.cancel.delete:hover {
        color: #1D1D1D;
        border: calc((1.5/832)*100dvh) solid#1D1D1D;
    }

    .users_popup-btn.confirm.delete {
        background-color: white;
        border: calc((1.5/832)*100dvh) solid #F0436C !important;
        color: #F0436C;
    }

    .users_popup-btn.confirm.delete:hover {
        background-color: #F0436C;
        color: white;
        border: calc((1.5/832)*100dvh) solid#F0436C;
    }

    .add_popup-content {
        margin-top: calc((273/832)*100dvh);
        background: white;
        width: calc((525 / 1280) * 100dvw);
        height: calc((266 / 832) * 100dvh);
        border-radius: calc((18/832)*100dvh);
        box-sizing: border-box;
        position: relative;
    }

    .add_popup-text {
        margin-top: calc((24/832)*100dvh);
        margin-left: calc((20/1280)*100dvw) !important;
        font-family: "Lato", sans-serif;
        font-weight: 700;
        font-style: Bold;
        font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
        letter-spacing: clamp(0.20px, calc((20 /100/ 1280) * 100dvw), 0.4px);
        ;
        line-height: calc((32/832)*100dvh);
    }

    .add_popup-close {
        position: absolute;
        width: calc((16 / 1280) * 100dvw);
        height: calc((16 / 832) * 100dvh);
        top: calc((16 / 832) * 100dvh);
        right: calc((16 / 1280) * 100dvw);
        ;
        cursor: pointer;
    }

    .add_form>textarea {
        width: calc((321 / 1280) * 100dvw);
        margin-left: calc((20 / 1280) * 100dvw);
        ;
        margin-top: calc((19/832)*100dvh);
        ;
        height: calc((39 / 832) * 100dvh);
        ;
        border-radius: calc((8 / 832) * 100dvh);
        ;
        border: calc((1.5 / 832) * 100dvh) solid #E0E0E0;
        ;
        padding-left: calc(15/1280*100dvw);
        padding-top: calc((8 / 832) * 100dvh);
        ;
        line-height: calc((22 / 832) * 100dvh);
        box-sizing: border-box;
        vertical-align: middle;


        font-family: Lato;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);

    }

    .add_custom-dropdown {
        margin-top: calc(10/832*100dvh);
        display: flex;
        margin-left: calc((20 / 1280) * 100dvw);
        ;
        justify-content: space-between;
        align-items: center;
        width: calc((189 / 1280) * 100dvw);
        height: calc((36 / 832) * 100dvh);
        border-radius: calc((14/832)*100dvh);
        background-color: #F3F3F3;
        box-sizing: border-box;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
        z-index: 999;
        letter-spacing: 0.1px;
        vertical-align: middle;
        box-sizing: border-box;
        padding-left: calc((15/1280)*100dvw);
        padding-right: calc((15/1280)*100dvw);
    }

    .add_custom-dropdown:hover {
        background-color: #DFDFDF;
    }

    .add_custom-arrow {
        width: calc((16 / 1280) * 100dvw);
        height: calc((9 / 832) * 100dvh);
        display: flex;
    }

    /* Стили для списка - ИЗМЕНЕНИЯ ЗДЕСЬ */
    .add_custom-dropdown-options {
        box-shadow: 0px 1px 13.8px 0px #00000040;
        border-radius: calc((8/832)*100dvh);
        width: calc((179 / 1280) * 100dvw) !important;
        height: calc((76 / 832) * 100dvh);
        margin-top: calc((10 / 832) * 100dvh);
        position: absolute;
        /* Позиционируем относительно родителя */
        left: calc((20 / 1280) * 100dvw);
        z-index: 9999;
        /* Увеличиваем z-index */
        background-color: white;
        /* Добавляем фон */
    }

    .add_custom-dropdown-option-list {
        margin-top: calc((15 / 832) * 100dvh);
        margin-left: calc((15 / 1280) * 100dvw);
        z-index: 10000;
        /* Увеличиваем z-index */
    }

    .add_custom-dropdown-options_header {
        font-family: "Lato", sans-serif;
        font-weight: 600;
        font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
        line-height: 120%;
        letter-spacing: 0.1px;
        vertical-align: middle;
        margin-top: calc((7 / 832) * 100dvh);
        margin-left: calc((41 / 1280) * 100dvw);
    }

    .add_custom-dropdown-selected {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.34px);
        vertical-align: middle;
    }

    .add_custom-dropdown-option {
        display: flex;
        align-items: center;
        margin-top: calc((9 / 832) * 100dvh);
        height: calc((19 / 832) * 100dvh);
        cursor: pointer;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        vertical-align: middle;
    }

    .add_custom-dropdown-circle {
        width: calc((17 / 1280) * 100dvw);
        height: calc((17 / 832) * 100dvh);
    }

    .add_custom-dropdown-circle>img {
        width: calc((17 / 1280) * 100dvw);
        height: calc((17 / 832) * 100dvh);
    }

    .add_custom-dropdown-text {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        vertical-align: middle;
        margin-left: calc((5 / 1280) * 100dvw);
        display: flex;
        align-items: center;
    }

    .add_popup-btn {
        width: calc((138 / 1280) * 100dvw);
        height: calc((41/832)*100dvh);
        font-size: clamp(20px, calc((20 / 1280) * 100dvw), 40px);
        font-family: "Lato", sans-serif;
        border-radius: calc((8/832)*100dvh);
        cursor: pointer;
        color: #6AB23D;
        border: calc((1.5/832)*100dvh) solid #6AB23D;
        background-color: white;
        margin-left: calc((366 / 1280) * 100dvw);
        ;
        margin-top: calc((45/832)*100dvh);
        ;
    }
}

@media (min-width:1918px),
(min-height:1078px) {
    .option_margin {
        margin-top: 17px !important;
    }

    .option_second_margin {
        margin-top: 4px !important;
    }

    .users_title {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 20px;
        letter-spacing: 0.2px;
        margin-top: 25px;
    }

    .users_form {
        margin-top: 20px;
        display: flex;

    }

    .users_list {
        margin-top: 12px;
        display: grid;
        grid-template-columns: 231px 805px;
        gap: 20px;
    }

    .users_list_groups {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;
        ;
        letter-spacing: 0.16px;
        ;
        width: 231px;
        height: 107px !important;
        padding-left: 10px;
        padding-top: 15px;
        border: 1.5px solid #E0E0E0;
        border-radius: 8px;
    }

    .users_list_groups>div {
        height: 19px;
        margin-bottom: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .group {
        position: relative;
    }

    .group_value {
        margin-left: 10px;
    }

    .group_active {
        position: absolute;
        height: 100%;
        background-color: #853CFF;
        width: 2px;
        ;
        border-radius: 2px;
    }


    .users_list_list {
        margin-top: 23px;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;
        ;
        letter-spacing: 0.16px;
        ;

    }

    .users_list_list_list {
        color: #1D1D1D !important;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;
        ;
        letter-spacing: 0.16px;
        ;
    }

    .users_list_list_header {
        margin-left: 18px;
        display: flex;
        align-items: center;
        height: 46.13px !important;
    }

    .users_list_list_header>div {
        position: relative;
        display: flex;
        align-items: center;
    }

    .users_list_list_name {
        width: 473px;
    }

    .users_list_list_role {
        width: 146px !important;
    }

    .open_role {
        margin-left: 10px;
        width: 16px;
        height: 9px;
    }

    .kick_user {
        margin-left: 110px;
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .users_list_list_role_margin {
        display: flex;
        width: 120px !important;
    }

    .users_list_list_line {
        background-color: #e9e9e9 !important;
        height: 1px !important;
    }

    .users_form_finder_header {

        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;
        ;
        letter-spacing: 0.16px;
        ;
        color: #1D1D1D;
    }

    .users_form_finder_finder {
        position: relative;
        display: flex;
        align-items: center;
    }

    .users_form_search-input {
        width: 231px;
        height: 39px;
        line-height: 39px;
        color: #1D1D1D !important;
        border: 1.5px solid #E0E0E0;
        border-radius: 8px;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;
        ;
        letter-spacing: 0.16px;
        ;
        display: flex;
        align-items: center;
        padding-left: 50px;
        box-sizing: border-box;
    }

    .users_form_search-input::placeholder {
        line-height: 39px;
        display: flex;
        align-items: center;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;
        ;
        letter-spacing: 0.16px;
        ;
        color: #A9A9A9;
    }

    .users_form_input-icon {
        position: absolute;
        left: 17px;
        top: 50%;
        transform: translateY(-50%);
        width: 19px;
        height: 19px;
        pointer-events: none;
    }

    .users_form_button {
        box-sizing: border-box;
        width: 157px !important;
        height: 39px;
        background-color: #6AB23D;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 20px;
        letter-spacing: 0.2px;
        ;

    }

    .users_form_button {
        margin-left: 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    .users_form_button>div {}

    .users_form_button>img {
        width: 19px;
        height: 19px;
    }

    .users_list_item-dropdown-options {
        position: absolute;
        top: calc(100% + 11px);
        box-shadow: 0px 1px 13.8px 0px #00000025;
        width: 310px;
        height: 106px;
        border-radius: 14px;
        left: -14px;
        background: white;
        z-index: 665455;

    }

    .users_list_item-dropdown-option {
        margin: 0 auto;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        color: #1D1D1D;
        white-space: nowrap;
        font-weight: 400;
        font-size: 20px;
        letter-spacing: 0.2px;
        ;
        width: 298px;
        height: 34px;
        padding-left: 8px;

    }

    .users_list_item-dropdown-option:hover {
        border-radius: 7px;
        background-color: #DFDFDF !important;
    }


    .users_popup-overlay {
        font-family: "Lato", sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        z-index: 1000;
    }

    .users_popup-content {
        margin-top: 273px;
        background: white;
        width: 524px;
        height: 233px;
        border-radius: 18px;
        box-sizing: border-box;


    }

    .users_change_popup-content {
        margin-top: 290px;
        background: white;
        width: 524px;
        height: 173px;
        border-radius: 18px;
        box-sizing: border-box;
    }

    .users_popup-text {
        margin-top: 24px !important;
        margin-left: 20px !important;
        font-family: "Lato", sans-serif;
        font-weight: 700;
        font-style: normal;
        font-style: Bold;
        font-size: 20px;
        line-height: 32px;
    }

    .users_popup-text_ {
        margin-top: 10px !important;
        margin-left: 20px !important;
        line-height: 19.2px;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #7D7D7D;
        letter-spacing: 0.16px !important;
        vertical-align: middle;
        font-style: normal;

    }

    .users_popup-buttons {
        display: flex;
        margin-top: 50px;
        margin-left: 218px;

    }

    .users_popup-btn.confirm {
        margin-left: 10px;
    }

    .users_popup-btn {
        width: 138px;
        height: 41px;
        font-size: 20px;
        font-family: "Lato", sans-serif;
        border-radius: 8px;
        cursor: pointer;
    }

    .users_popup-btn.confirm {
        background-color: #6ab23d;
        border: 1.5px solid #6ab23d;
        color: white;
    }

    .users_popup-btn.confirm:hover {
        background-color: #559130;
        border: 1.5px solid#559130;
    }

    .users_popup-btn.cancel {
        background-color: #FFFFFF;
        border: 1.5px solid #853CFF;
        color: #853CFF;
    }

    .users_popup-btn.cancel:hover {
        color: #FFFFFF;
        background-color: #AA77FF;
    }

    .users_popup-btn.cancel.delete {
        background-color: #FFFFFF;
        border: none;
        color: #7D7D7D;
    }

    .users_popup-btn.cancel.delete:hover {
        color: #1D1D1D;
        border: 1.5px solid#1D1D1D;

    }

    .users_popup-btn.confirm.delete {
        background-color: white;
        border: 1.5px solid#F0436C;
        color: #F0436C;
    }

    .users_popup-btn.confirm.delete:hover {
        background-color: #F0436C;
        color: white;
        border: 1.5px solid#F0436C;
    }

    .height {
        height: 173px !important;
    }

    .margin {
        margin-top: 18px !important;
        margin-left: 203px !important;
    }

    .margin_text {
        height: 64px !important;
    }

    .margin_left {
        width: 150px !important;
    }

    .add_popup-content {
        margin-top: 273px;
        background: white;
        width: 525px;
        height: 266px;
        border-radius: 18px;
        box-sizing: border-box;
        position: relative;
    }

    .add_popup-text {
        margin-top: 24px;
        margin-left: 20px !important;
        font-family: "Lato", sans-serif;
        font-weight: 700;
        font-style: Bold;
        font-size: 20px;
        letter-spacing: 0.2px;
        ;
        line-height: 32px;
    }

    .add_popup-close {
        position: absolute;
        width: 16px;
        height: 16px;
        top: 16px;
        right: 16px;
        ;
        cursor: pointer;
    }

    .add_form>textarea {
        width: 321px;
        margin-left: 20px;
        ;
        margin-top: 19px;
        ;
        height: 39px;
        ;
        border-radius: 8px;
        ;
        border: 1.5px solid #E0E0E0;
        ;
        padding-left: 15px;
        padding-top: 8px;
        ;
        line-height: 22px;
        box-sizing: border-box;
        vertical-align: middle;


        font-family: Lato;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;
        letter-spacing: 0.16px;

    }

    .add_custom-dropdown {
        margin-top: 10px;
        display: flex;
        margin-left: 20px;
        ;
        justify-content: space-between;
        align-items: center;
        width: 189px;
        height: 36px;
        border-radius: 14px;
        background-color: #F3F3F3;
        box-sizing: border-box;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: 16px;
        z-index: 999;
        letter-spacing: 0.1px;
        vertical-align: middle;
        box-sizing: border-box;
        padding-left: 15px;
        padding-right: 15px;
    }

    .add_custom-dropdown:hover {
        background-color: #DFDFDF;
    }

    .add_custom-arrow {
        width: 16px;
        height: 9px;
        display: flex;
    }

    /* Стили для списка - ИЗМЕНЕНИЯ ЗДЕСЬ */
    .add_custom-dropdown-options {
        box-shadow: 0px 1px 13.8px 0px #00000040;
        border-radius: 8px;
        width: 179px !important;
        height: 76px;
        margin-top: 10px;
        position: absolute;
        /* Позиционируем относительно родителя */
        left: 20px;
        z-index: 9999;
        /* Увеличиваем z-index */
        background-color: white;
        /* Добавляем фон */
    }

    .add_custom-dropdown-option-list {
        margin-top: 15px;
        ;
        margin-left: 15px;
        ;
        z-index: 10000;
        /* Увеличиваем z-index */
    }

    .add_custom-dropdown-options_header {
        font-family: "Lato", sans-serif;
        font-weight: 600;
        font-size: 16px;
        line-height: 120%;
        letter-spacing: 0.1px;
        vertical-align: middle;
        margin-top: 7px;
        margin-left: 41px;
    }

    .add_custom-dropdown-selected {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: 16px;
        letter-spacing: 0.16px;
        vertical-align: middle;
    }

    .add_custom-dropdown-option {
        display: flex;
        align-items: center;
        margin-top: 9px;
        height: 19px;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: 16px;
        letter-spacing: 0.16px;
        vertical-align: middle;
    }

    .add_custom-dropdown-circle {
        width: 17px;
        height: 17px;
    }

    .add_custom-dropdown-circle>img {
        width: 17px;
        height: 17px;
    }

    .add_custom-dropdown-text {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: 16px;
        letter-spacing: 0.16px;
        vertical-align: middle;
        margin-left: 5px;
        display: flex;
        align-items: center;
    }

    .add_popup-btn {
        width: 138px;
        height: 41px;
        font-size: 20px;
        font-family: "Lato", sans-serif;
        border-radius: 8px;
        cursor: pointer;
        color: #6AB23D;
        border: 1.5px solid #6AB23D;
        background-color: white;
        margin-left: 366px;
        margin-top: 45px;
    }
}

textarea {
    resize: none;
}

* {
    box-sizing: border-box;
}
</style>