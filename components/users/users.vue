<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { object, string, type InferType } from 'yup'
import { mutateAddParticipant } from '~/composables/api/auth/useAuthMutation'
import type { OrganizationParticipantRoleChange, OrganizationParticipantsFilter } from '~/composables/api/organization/organization.types'
import { mutateOrganizationParticipants } from '~/composables/api/organization/useOrganizationMutation'
import { useOrganizationParticipants } from '~/composables/api/organization/useOrganizationQuery'
import { useAuthStore } from '~/store/auth'

const activeGroup = ref<OrganizationParticipantsFilter>('all')
const userId = useState('telegramUser')
const auth = useAuthStore()
const userRole = auth.$state.role
const { data: org_participants, isLoading, refetch } = useOrganizationParticipants(activeGroup)
const { $queryClient } = useNuxtApp()
const { mutate: patchRole } = mutateOrganizationParticipants()

const { mutate: addParticipantFn } = mutateAddParticipant()

const schemaAdd = object({
  email: string().email('Введите корректную почту').required('Введите почту').max(32, 'Максимальная длина 32 символа'),

})
type SchemaAdd = InferType<typeof schemaAdd>
const initialAdd = {
  email: '',
}
const stateAdd = reactive({ ...initialAdd })
const formAdd = useTemplateRef('formAdd')
async function onSubmitAdd(event: FormSubmitEvent<SchemaAdd>) {
  try {
    await addParticipantFn({ role: selectedText.value, email: event.data.email })
    closeAddPopup()
  }
  catch {
    window.alert('Произошла ошибка')
  }
  finally {

  }
}
const groups = {
  all: 'Все',
  admin: 'Администраторы',
  leader: 'Ведущие',
}


const isOpen = ref(false)
const current_id = ref(0)
function toggleItemDropdown(id) {
  if (current_id.value === id) {
    current_id.value = undefined
  }
  else {
    current_id.value = id
  }
}
function getDropdownIcon(id) {
  return current_id.value === id
    ? '../images/users/close_role.svg'
    : '../images/users/open_role.svg'
}
const canChangeRole = (participantRole: string, yourRole: string, isYou: boolean) => {
  if (isYou) return false // с самим собой нельзя действия производить
  if (yourRole === 'organizer') {
    // если вы орг, то вы можете удалять кого угодно и менять роль кому угодно
    return true
  }
  else if (yourRole === 'admin') {
    if (participantRole === 'organizer') return false
    if (participantRole === 'leader') return true // если вы админ то вы можете поменять роль только ведущему и только на админа
    if (participantRole === 'admin') return false
  }
  else return false // если вы не админ и не орг то никакие действия не можете выполнять
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
  patchRole({ participant_id: deleteId.value, role: 'remote' })
  showDeletePop.value = false
  currentName.value = ''
  deleteId.value = 0
}
const changeRoleUserId = ref<number>(0)
const tochangeRole = ref<OrganizationParticipantRoleChange>('leader')
const showChangeRole = ref(false)
async function showChange(role: OrganizationParticipantRoleChange, currName: string, id: number) {
  showChangeRole.value = true
  tochangeRole.value = role
  currentName.value = currName
  changeRoleUserId.value = id
  current_id.value = 0
}
async function hidePopupChange() {
  showChangeRole.value = false
  tochangeRole.value = 'leader'
  currentName.value = ''
  changeRoleUserId.value = 0
}
async function ChangeRole() {
  patchRole({
    role: tochangeRole.value,
    participant_id: changeRoleUserId.value,
  })
  showChangeRole.value = false
  tochangeRole.value = 'leader'
  currentName.value = ''
  changeRoleUserId.value = 0
}

const showAddPop = ref(false)
function toggleDropdown() {
  isOpen.value = !isOpen.value
}
const options_code = {
  leader: 'Ведущий',
  admin: 'Администратор',
}
const selectedText = ref('leader')
async function selectOption(option: string) {
  selectedText.value = option
  isOpen.value = false
}
async function addParticipant() {
  addParticipantFn({ role: selectedText.value, email: nameToAdd.value })
}
function onAddClick() {
  showAddPop.value = true
}
const nameToAdd = ref('')
function resetAddForm() {
  // Сбрасываем поля
  Object.assign(stateAdd, initialAdd)
  // Сбрасываем выбранный вариант
  selectedText.value = 'leader'
  // Сбрасываем ошибки формы (если используешь UForm, есть метод reset)
  formAdd.value?.clear()
}
// Кнопка закрытия попапа
function closeAddPopup() {
  showAddPop.value = false
  isOpen.value = false
  resetAddForm()
}
const expandedTitles = reactive<{ [key: string]: boolean }>({})
const expandedLeaders = reactive<{ [key: string]: boolean }>({})
// Функции для переключения раскрытия
function toggleTitle(id: string) {
  expandedTitles[id] = !expandedTitles[id]
}

function toggleLeader(id: string) {
  expandedLeaders[id] = !expandedLeaders[id]
}
const startY = ref(0)
const currentY = ref(0)
const isMobile = useMediaQuery('(max-width: 767px)')
const $style = useCssModule()
const isDragging = ref(false)
const roles = {
  admin: computed(() => isMobile.value ? 'Админ' : 'Администратор'),
  leader: computed(() => isMobile.value ? 'Ведущий' : 'Ведущий'),
  organizer: computed(() => isMobile.value ? 'Создатель' : 'Создатель организации'),
}

function onTouchStart(e: TouchEvent) {
  if (!isMobile.value) return
  isDragging.value = true
  startY.value = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  if (!isMobile.value || !isDragging.value) return

  currentY.value = e.touches[0].clientY
  const diff = currentY.value - startY.value

  if (diff > 0) {
    e.preventDefault()
    const sheet = document.querySelector(`.${$style.users__popup}`) as HTMLElement
    if (sheet) {
      sheet.style.transform = `translateY(${diff}px)`
      sheet.style.transition = 'none'
    }
  }
}

function onTouchEnd(e: TouchEvent) {
  if (!isMobile.value || !isDragging.value) return
  isDragging.value = false

  const diff = currentY.value - startY.value
  const sheet = document.querySelector(`.${$style.users__popup}`) as HTMLElement

  if (!sheet) return
  // Добавляем плавную анимацию для возврата или закрытия
  sheet.style.transition = 'transform 0.01s ease'
  if (diff > 150) {
    // закрываем
    e.preventDefault()
    showDeletePop.value = false
    showChangeRole.value = false
    showAddPop.value = false
    sheet.style.transform = ''
  } else {
    // возвращаем назад
    sheet.style.transform = 'translateY(0)'
  }
}
watch([showDeletePop, showChangeRole, showAddPop], (val) => {
  document.body.classList.toggle('modal-open', showDeletePop.value || showChangeRole.value || showAddPop.value)
})
</script>

<template>
  <layout :active_nav="'users'">
    <div :class="$style.users">
      <div :class="$style.users__header">
        Пользователи
      </div>
      <form :class="$style.users__form">
        <div :class="$style.users__form_finder">
          <img src="/public/images/history/finder.svg" :class="$style.users__form_finder_icon">

          <input type="text" placeholder="Поиск пользователей" :class="$style.users__form_finder_input" maxlength="32">
        </div>
        <div @click="onAddClick()" :class="$style.users__form_button">
          <div :class="$style.users__form_button_text">
            Добавить
          </div>
          <img src="/public//images/users/add.svg" :class="$style.users__form_button_desk"></img>
          <div :class="$style.users__form_button_mobile">
            <img src="/public/images/users/add_mobile.svg" />
          </div>
        </div>
      </form>
      <div :class="$style.users__list">
        <div :class="$style.users__list_groups">
          <div v-for="(value, key) in groups" :class="$style.users__list_group"
            @click="activeGroup = key; current_id = undefined;">

            <div :class="[activeGroup == key ? $style.users__list_group_active : $style.users__list_group]">
              {{ value }}
            </div>
          </div>
        </div>
        <div :class="$style.users__list_body">
          <div :class="$style.users__list_body_header" style="color: #853CFF;">
            <span>
              Имя
            </span>
            <span>
              Роль
            </span>
          </div>
          <div :class="$style.users__list_body_list">
            <div v-for="(user, key) in org_participants?.participants" :key="key" :class="$style.users__list_user">
              <div :class="$style.users__list_user_header">

                <span
                  :class="[$style.users__list_user_name, $style.titleClamp, expandedTitles[user.id] ? $style.expanded : '']"
                  class="title-clamp" @click="toggleTitle(String(user.id))">
                  {{ user?.name }}
                </span>
                <span
                  :class="[$style.users__list_user_login, $style.titleClamp, expandedLeaders[user.id] ? $style.expanded : '']"
                  class="title-clamp" @click="toggleLeader(String(user.id))">
                  @{{ user?.username }}
                </span>

              </div>
              <div :class="$style.users__list_user_role">
                <div :class="$style.users__list_user_role_text">
                  <div :style="{ cursor: canChangeRole(user.role, userRole, user.is_you) ? 'pointer' : 'default' }"
                    @click=" canChangeRole(user.role, userRole, user.is_you) && toggleItemDropdown(user.id)">
                    <div :class="{ users_list_list_role_margin: userRole !== 'organizer' }">
                      {{ roles[user.role] }}
                    </div>

                    <img v-if="canChangeRole(user.role, userRole, user.is_you)" class="open_role"
                      :src="getDropdownIcon(user.id)">
                  </div>
                  <img v-if="canChangeRole(user.role, userRole, user.is_you)" :class="$style.hide"
                    src="/public/images/users/kick_user.svg" @click=" showDelete(user.name, user.id)">
                  <img v-if="canChangeRole(user.role, userRole, user.is_you)" :class="$style.hide_mobile"
                    src="/public/images/users/kick_mobile.svg" @click=" showDelete(user.name, user.id)">
                </div>
                <div v-if="current_id === user.id && canChangeRole(user.role, userRole, user.is_you)"
                  class="users_list_item-dropdown-options" style=" z-index: 10001 !important;"
                  :class="$style.users__list_user_dropdown">
                  <div class="users_list_item-dropdown-option"
                    @click="user.role !== 'admin' && showChange('admin', user.name, user.id)"
                    :class="$style.users__list_user_dropdown_option">
                    <span>Выдать роль “Администратор”</span>
                  </div>
                  <div :class="$style.users__list_user_dropdown_option"
                    @click="user.role !== 'leader' && showChange('leader', user.name, user.id)">
                    <span>Выдать роль “Ведущий”</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      <div v-if="showDeletePop" class="users_popup-overlay" :class="[$style.users__popup_overlay]">
        <div class="users_popup-content" :class="[$style.users__popup, $style.users__popup_delete]" @click.stop
          @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
          <div :class="$style.users__popup_line"></div>
          <div class="users_popup-text" :class="$style.users__popup_text">
            Вы уверены, что хотите удалить пользователя<br><span style="color: #853CFF;">{{ currentName }}</span>?
          </div>
          <div class="users_popup-text_" :class="$style.users__popup_text_">
            Это действие отменить будет невозможно.
          </div>
          <div class="users_popup-buttons" :class="[$style.users__popup_buttons, $style.users__popup_buttons_delete]">
            <button class="users_popup-btn cancel delete" @click="hidePopup()"
              :class="[$style.users__popup_btn, $style.users__popup_btn_first, $style.users__popup_btn_first_delete]">
              Отменить
            </button>
            <button class="users_popup-btn confirm delete" @click="deleteParticipants()"
              :class="[$style.users__popup_btn, $style.users__popup_btn_second, $style.users__popup_btn_second_delete]">
              Удалить
            </button>
          </div>
        </div>
      </div>
      <div v-if="showChangeRole" class="users_popup-overlay" :class="$style.users__popup_overlay" @click.stop
        @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
        <div class="users_change_popup-content" :class="$style.users__popup">
          <div :class="$style.users__popup_line"></div>
          <div class="users_popup-text" :class="$style.users__popup_text">
            Вы уверены, что хотите выдать роль
            “{{ tochangeRole === 'leader' ? "Ведущий" : "Администратор" }}” пользователю <span
              style="color: #853CFF;">@{{
                currentName }}?</span>
          </div>
          <div class="users_popup-buttons" :class="$style.users__popup_buttons">
            <button class="users_popup-btn cancel" @click="hidePopupChange()"
              :class="[$style.users__popup_btn, $style.users__popup_btn_first, $style.users__popup_btn_first_change]">
              Отменить
            </button>
            <button class="users_popup-btn confirm" @click="ChangeRole()"
              :class="[$style.users__popup_btn, $style.users__popup_btn_second, $style.users__popup_btn_second_change]">
              Выдать
            </button>
          </div>
        </div>
      </div>
      <div v-if="showAddPop" class="users_popup-overlay" :class="$style.users__popup_overlay" @click.stop
        @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
        <div class="add_popup-content" :class="[$style.users__popup, $style.users__popup_add]">
          <div :class="$style.users__popup_line"></div>
          <img src="/images/history/Vector_1.svg" class="add_popup-close" @click="closeAddPopup()">
          <div class="add_popup-text" :class="$style.users__popup_text">
            Добавление пользователя в организацию
          </div>
          <UForm ref="formAdd" :validate-on="['input']" :schema="schemaAdd" :state="stateAdd" class="add_form"
            @submit="onSubmitAdd">
            <UFormField v-slot="{ error }" :ui="{ error: 'error' }" :validate-on-input-delay="0"
              :eager-validation="true" label="" name="email">
              <UInput v-model="stateAdd.email" placeholder="Введите email"
                :ui="{ base: error ? 'input error' : (stateAdd.email ? 'input success' : 'input') }" />
            </UFormField>

            <div class="add_custom-dropdown" @click="toggleDropdown">
              <div class="add_custom-dropdown-selected">
                {{ options_code[selectedText] }}
              </div>
              <div class="add_custom-arrow" :class="{ open: isOpen }">
                <img v-if="isOpen" src="/public/images/interactives/open.svg">
                <img v-if="!isOpen" src="/public/images/interactives/close.svg">
              </div>
            </div>
            <div v-if="isOpen" class="add_custom-dropdown-options">
              <div class="add_custom-dropdown-option-list">
                <div v-for="(label, value) in options_code" :key="value" class="add_custom-dropdown-option"
                  @click="selectOption(value)" :class="{ active: selectedText === value }">
                  <img v-if="selectedText === value" class="add_custom-dropdown-circle"
                    src="/public/images/interactives/picked.svg">
                  <img v-else class="add_custom-dropdown-circle" src="/public/images/interactives/Ellipse.svg">
                  <div class="add_custom-dropdown-text" :class="{ active: selectedText === value }">
                    {{ label }}
                  </div>
                </div>
              </div>
            </div>
            <UButton class="add_popup-btn" type="submit">
              Добавить
            </UButton>
          </UForm>
        </div>
      </div>
    </div>

  </layout>
</template>
<style>
.title-clamp::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: calc((31 / 1280) * 100dvw);
  height: 100%;
  pointer-events: none;
  background: linear-gradient(85.63deg, rgba(255, 255, 255, 0.4) 29.36%, #ffffff 89.3%);

}

.title-clamp.expanded::after {
  display: none;
  /* только у текущего элемента с expanded */
}

@media (min-width:768px) {
  .title-clamp::after {
    display: none;
    cursor: default;
  }
}
</style>
<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
}

.titleClamp {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  max-width: 100%;
  flex: 1;

  @media (min-width:768px) {
    cursor: default;
  }
}

.expanded {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
}

.titleClamp::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 35px;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(85.63deg, rgba(247, 247, 247, 0.4) 26.36%, #F7F7F7 89.3%);

}

.expanded::after {
  display: none;
}

.hide {
  display: none;

  @media (min-width:768px) {
    display: block;
  }

}

.hide_mobile {

  @media (min-width:768px) {
    display: none;
  }

}

.users {
  padding: 0 22px;
  margin-top: 10px;
  width: 100%;
  font-size: 14px;

  @media (min-width:768px) {
    padding: 0;
    width: calc(100% - 44px);
    max-width: 1056px;
    margin: 0 auto;
  }


  &__header {
    font-size: 14px;
    color: #1D1D1D;

    @media (min-width:768px) {
      font-size: 20px;
      margin-top: 25px;
    }
  }

  &__form {
    margin-top: 5px;
    display: flex;
    height: 29px;
    width: 100%;
    gap: 10px;

    @media (min-width:768px) {
      display: flex;
      font-size: 20px;
      margin-top: 20px;
      width: 408px;
      height: 39px;
      gap: 20px;
    }

    &_finder {
      position: relative;
      display: flex;
      align-items: center;

      width: 100%;

      @media (min-width:768px) {
        width: 231px;
        height: 39px;
      }

      &_icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 19px;
        height: 19px;
        pointer-events: none;

        @media (min-width:768px) {
          width: 19px;
          height: 19px;
          left: 17px;
        }
      }

      &_input {
        width: 100%;
        height: 29px;
        line-height: 29px;
        color: #1D1D1D !important;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding-left: 35px;
        box-sizing: border-box;

        @media (min-width:768px) {
          font-size: 16px;
          height: 39px;
          padding-left: 50px;
        }

        &::placeholder {
          line-height: 29px;
          display: flex;
          align-items: center;
          font-family: "Lato", sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #A9A9A9;

          @media (min-width:768px) {
            font-size: 16px;
          }
        }


      }
    }

    &_button {
      display: flex;
      align-items: center;
      justify-content: space-between;


      @media (min-width:768px) {
        background-color: #6AB23D;
        width: 157px;
        padding: 0 18px;
        color: white;
        border-radius: 5px;
      }

      &_text {
        display: none;

        @media (min-width:768px) {

          display: block;
        }
      }

      &_desk {
        display: none;

        @media (min-width:768px) {

          display: block;
        }
      }

      &_mobile {
        width: 29px;
        height: 29px;
        background-color: #E0F9C7;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        @media (min-width:768px) {

          display: none;
        }
      }
    }
  }

  &__list {
    margin-top: 18px;

    @media (min-width:768px) {

      display: flex;
      gap: 20px;
      margin-top: 12px;
    }

    &_groups {
      display: flex;
      align-items: center;
      height: 17px;
      gap: 10px;

      @media (min-width:768px) {
        display: flex;
        flex-direction: column;
        width: 231px;
        height: 107px;
        border: 1.5px solid #E0E0E0;
        border-radius: 8px;
        align-items: flex-start;
        padding: 16px 10px 16px 0px;
      }


    }

    &_group {
      color: #A9A9A9;
      font-size: 14px;
      border-bottom: 1px solid #FFFFFF;
      box-sizing: border-box;

      @media (min-width:768px) {
        padding: 0;
        font-size: 16px;
        color: #1D1D1D;
        height: 17px;
        padding-left: 10px;
        border-left: 2px solid #FFFFFF;
      }

      &_active {

        font-size: 14px;
        border-bottom: 1px solid #853CFF;
        position: relative;
        box-sizing: border-box;
        color: #1D1D1D;

        @media (min-width:768px) {
          border: none;
          padding: 0;
          font-weight: 600;
          border-left: 2px solid #853CFF;
          font-size: 16px;
          color: #1D1D1D;
          height: 17px;
          padding-left: 10px;
        }
      }
    }

    &_body {
      @media (min-width:768px) {
        width: 805px;
      }

      &_header {
        font-size: 14px;
        height: 24px;
        display: flex;
        align-items: center;
        margin-top: 20px;
        padding-left: 10px;
        margin-bottom: 5px;

        @media (min-width:768px) {
          max-width: 805px;
          padding: 0;
          font-size: 16px;
          margin-top: 23px;
          color: #853CFF;
          padding-left: 18px;
          height: 45px !important;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #1D1D1D1D;
          margin-bottom: 0px;
        }

        span:last-child {
          // стили для "Роль"
          width: 160px;
          max-width: 160px;
          margin-left: auto;

          @media (min-width:768px) {
            width: 314px;
            max-width: 314px;
            margin-left: auto;
          }
        }


      }

      &_list {
        display: flex;
        flex-direction: column;
        gap: 10px;

        @media (min-width:768px) {
          gap: 0px;
        }
      }
    }

    &_user {

      display: flex;
      align-items: center;
      padding: 0 10px;
      border: 1px solid #F7F7F7;
      border-radius: 5px;
      color: #1D1D1D;
      background-color: #F7F7F7;

      @media (min-width:768px) {
        border: none;
        margin: 0;
        border-bottom: 1px solid #1D1D1D1D;
        background-color: white;
        padding: 0;
        padding-left: 18px;
        height: 45px !important;
        font-size: 16px;
      }

      &_header {
        display: grid;
      }

      &_name {
        width: 140px;


        &.expanded {
          white-space: normal;
          word-break: break-word;
          overflow-wrap: break-word;
        }
      }

      &_login {
        width: 140px;

        &.expanded {
          white-space: normal;
          word-break: break-word;
          overflow-wrap: break-word;
        }
      }

      &_role {
        position: relative;
        margin-left: auto;
        white-space: nowrap;

        @media (min-width:768px) {
          color: #7D7D7D;
        }

        &_text {
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          @media (min-width:768px) {
            width: 282px;
            max-width: 282px;
            margin-right: 32px;
          }

          &>div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 80px;

            @media (min-width:768px) {
              width: 146px;
              max-width: 146px;
            }

            &>img {
              width: 14px;
              height: 8px;

              @media (min-width:768px) {
                width: 16px;
                height: 9px;
              }
            }
          }

          &>img {
            width: 20px;
            height: 20px;

            @media (min-width:768px) {
              width: 25px;
              height: 25px;
            }
          }
        }
      }

      &_dropdown {
        position: absolute;
        top: calc(100% + 11px);
        box-shadow: 0px 1px 13.8px 0px #00000025;
        width: 222px;
        height: 66px;
        border-radius: 8px;
        left: -97px;
        background: white;
        z-index: 665455;
        display: flex;
        flex-direction: column;
        padding: 6px;

        @media (min-width:768px) {
          left: -14px;
          width: 310px;
          height: 106px;
          font-size: 20px;
          color: #1D1D1D;
          padding: 17px 6px;
          gap: 4px;
          box-shadow: 0px 1px 13.8px 0px #00000040;

        }

        &_option {
          padding: 4px;
          height: 25px;
          white-space: nowrap;

          @media (min-width:768px) {
            height: 34px;
            padding: 0px 5px;
          }

          &:hover {


            @media (min-width:768px) {
              background-color: #E0E0E0;
              border-radius: 7px;
            }
          }
        }
      }
    }
  }

  &__popup {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    background: white;
    height: 458px;
    margin-top: auto;
    width: 100%;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    touch-action: pan-y; // Разрешаем только вертикальный скролл
    transition: transform 1s ease;

    @media (min-width:768px) {
      width: 524px;
      height: 173px;
      margin-top: 290px;
      border-radius: 18px;
    }

    &_delete {
      @media (min-width:768px) {
        height: 233px;
      }
    }

    &_add {
      @media (min-width:768px) {
        height: 266px;
      }
    }

    &>img {
      display: none;

      @media (min-width:768px) {
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        top: 20px;
        right: 20px;
      }
    }

    &_overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #00000052;

      z-index: 22222999;

      display: flex;
      justify-content: center;
    }

    &_line {
      background-color: #A9A9A9;
      border-radius: 5px;
      height: 5px;
      width: 72px;
      margin: 0 auto;
      margin-top: 20px;

      @media (min-width:768px) {
        display: none;

      }
    }

    &_text {
      font-size: 14px;
      padding: 0 22px;
      margin-top: 40px;
      font-weight: 500;


      @media (min-width:768px) {
        font-size: 20px;
        padding: 0 22px;
        margin-top: 29px;
        line-height: 32px;
        font-weight: 700;
        vertical-align: middle;
      }

      &>span {
        @media (min-width:768px) {
          padding: 0;
        }
      }

      &_ {
        font-size: 14px;
        padding: 0 22px;
        margin-top: 10px;
        color: #7D7D7D;

        @media (min-width:768px) {
          font-size: 16px;

        }
      }
    }

    &_buttons {
      padding: 0 22px;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      margin-top: 148px;

      @media (min-width:768px) {
        margin-top: 19px;
        display: flex;
        flex-direction: row;
        margin-left: 186px;
      }

      &_delete {
        @media (min-width:768px) {
          margin-top: 56px;
        }
      }
    }



    &_btn {
      height: 44px;
      border-radius: 8px;
      font-size: 16px;

      @media (min-width:768px) {
        height: 41px;
        font-size: 20px;
        cursor: pointer;
      }

      &_first {
        @media (min-width:768px) {
          width: 138px;
        }

        &_delete {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;


          @media (min-width:768px) {
            background-color: white;
            border: 1px solid white;
            color: #7D7D7D;
          }

          &:hover {
            @media (min-width:768px) {
              border: 1px solid #1D1D1D;
              color: #1D1D1D;
            }
          }
        }

        &_change {
          background-color: white;
          border: 1px solid #853CFF;
          color: #853CFF;

          &:hover {
            @media (min-width:768px) {
              background-color: #AA77FF;
              color: white;
            }
          }
        }



      }

      &_second {
        @media (min-width:768px) {
          width: 150px;
        }

        &_delete {
          background-color: #F0436C;
          color: white;
          border: 1px solid #F0436C;

          @media (min-width:768px) {
            background-color: white;
            border: 1px solid #F0436C;
            color: #F0436C;
          }

          &:hover {
            @media (min-width:768px) {
              border: 1px solid #F0436C;
              background-color: #F0436C;
              color: white;
            }
          }
        }

        &_change {
          background-color: #6AB23D;
          color: white;
          border: 1px solid #6AB23D;

          &:hover {
            @media (min-width:768px) {
              background-color: #559130;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.add_form .input {
  width: calc(100% - 44px);
  margin-left: 20px;
  margin-top: 10px;
  height: 39px;
  border-radius: 8px;
  border: 1.5px solid #E0E0E0;
  padding-left: 15px;
  line-height: 22px;
  box-sizing: border-box;

  font-size: 14px;

}

.input.error {
  border: 1.5px solid #F0436C !important;
}

.input.success {
  border: 1.5px solid #6AB23D !important;
  color: #6AB23D;
}

.add_custom-dropdown {
  margin-top: 10px;
  display: flex;
  margin-left: 20px;
  justify-content: space-between;
  align-items: center;
  width: 147px;
  height: 36px;
  border-radius: 14px;
  background-color: #F3F3F3;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 122px !important;
  z-index: 999;
  padding-left: 10px;
  padding-right: 10px;
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
  width: 125px !important;
  height: 66px;
  margin-top: 5px;
  position: absolute;
  /* Позиционируем относительно родителя */
  left: 20px;
  z-index: 9999;
  /* Увеличиваем z-index */
  background-color: white;
  /* Добавляем фон */
  padding: 6px;
}

.add_custom-dropdown-option-list {
  z-index: 10000;
  /* Увеличиваем z-index */
}

.add_custom-dropdown-options_header {
  font-weight: 600;
  font-size: 14px;
}

.add_custom-dropdown-selected {
  font-weight: 400;
  font-size: 14px;
}

.add_custom-dropdown-option {

  display: flex;
  align-items: center;
  height: 25px;
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
}

.add_custom-dropdown-circle {
  display: none;
  width: 17px;
  height: 17px;
}

.add_custom-dropdown-circle>img {
  display: none;
  width: 17px;
  height: 17px;
}

.add_custom-dropdown-text {
  padding: 4px;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.add_custom-dropdown-option.active {
  background-color: #E0E0E0;
  border-radius: 7px;
}

.add_popup-btn {
  width: calc(100% - 44px);
  margin: 0 22px;
  margin-top: 168px;
  height: 41px;
  font-size: 20px;
  font-family: "Lato", sans-serif;
  border-radius: 8px;
  cursor: pointer;
  color: #6AB23D;
  border: 1.5px solid #6AB23D;
  background-color: white;

  &:hover {
    background-color: #6AB23D;
    color: white;
  }
}

.error {

  color: #F0436C;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 12px;
  padding-left: 22px;
  line-height: 110.00000000000001%;
  letter-spacing: 0%;
  vertical-align: middle;

}

@media (min-width:768px) {
  .add_form .input {
    width: 321px;
    margin-left: 20px;
    margin-top: 20px;
    height: 39px;
    border-radius: 8px;
    border: 1.5px solid #E0E0E0;
    padding-left: 15px;
    line-height: 22px;
    box-sizing: border-box;

    font-size: 16px;

  }

  .input.error {
    border: 1.5px solid #F0436C !important;
  }

  .input.success {
    border: 1.5px solid #6AB23D !important;
    color: #6AB23D;
  }

  .add_custom-dropdown {
    margin-top: 10px;
    display: flex;
    margin-left: 20px;
    justify-content: space-between;
    align-items: center;
    width: 189px;
    height: 36px;
    border-radius: 14px;
    background-color: #F3F3F3;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 122px !important;
    z-index: 999;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 16px;
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
    padding: 16px;
    /* Добавляем фон */
    display: flex;
    flex-direction: column;
    gap: 8px;

  }

  .add_custom-dropdown-option-list {
    z-index: 10000;
    /* Увеличиваем z-index */
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .add_custom-dropdown-options_header {
    font-weight: 600;
    font-size: 16px;
  }

  .add_custom-dropdown-selected {
    font-weight: 400;
    font-size: 16px;
  }

  .add_custom-dropdown-option {
    padding: 0;
    display: flex;
    align-items: center;
    height: 17px;
    cursor: pointer;
    font-weight: 400;
    font-size: 162px;
  }

  .add_custom-dropdown-circle {
    display: block;
    width: 17px;
    height: 17px;
  }

  .add_custom-dropdown-circle>img {
    display: block;
    width: 17px;
    height: 17px;
  }

  .add_custom-dropdown-text {
    padding: 5px;
    font-weight: 400;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .add_custom-dropdown-option.active {
    background-color: white;
    border-radius: 7px;
  }

  .add_popup-btn {
    position: absolute;
    bottom: 20px;
    right: 0px;
    width: 138px;
    height: 41px;
    font-size: 20px;
    font-family: "Lato", sans-serif;
    border-radius: 8px;
    cursor: pointer;
    color: #6AB23D;
    border: 1.5px solid #6AB23D;
    background-color: white;


  }

  .add_popup-btn:hover {
    background-color: #6AB23D;
    color: white;
  }

  .error {
    color: #F0436C;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 12px;
    padding-left: 22px;
    line-height: 110.00000000000001%;
    letter-spacing: 0%;
    vertical-align: middle;

  }
}
</style>