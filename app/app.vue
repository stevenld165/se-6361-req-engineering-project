<script setup lang="ts">
import { useSpeechRecognition, useSwipe } from "@vueuse/core"
import { validRooms, type Room } from "./consts"

const showSpeechDialog = ref(false)
const isListening = ref(false)

const speech = useSpeechRecognition({
  lang: "en-US",
  continuous: false,
})

const handleToggleListeningDialog = () => {
  showSpeechDialog.value = true
  isListening.value = true

  const intructionUtterance = new SpeechSynthesisUtterance("Now listening...")
  speechSynthesis.speak(intructionUtterance)

  speech.result.value = ""
  speech.start()
}

const handleStopListening = () => {
  isListening.value = false
  speech.stop()
}

onMounted(() => {
  speechSynthesis.cancel()
  const introUtterance = new SpeechSynthesisUtterance(
    "Welcome to NautiNav. Tap anywhere to begin.",
  )
  speechSynthesis.speak(introUtterance)
})

watch(speech.isFinal, (newValue, oldValue) => {
  if (newValue == true) {
    handleProcessResults()
  }
})

const selectedRoom = ref<Room>()

const handleProcessResults = async () => {
  const normalizedResult = speech.result.value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")

  console.log(normalizedResult)

  if (validRooms.has(normalizedResult)) {
    speechSynthesis.cancel()
    selectedRoom.value = validRooms.get(normalizedResult)

    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        `Found room: ${selectedRoom.value?.displayName}. Is this correct? Swipe right or say 'yes' to confirm, or swipe left or say 'no' to cancel.`,
      ),
    )

    speech.stop()
    speech.result.value = ""
    speech.start()

    console.log("listening: ", speech)

    watch(
      isSwiping,
      async (newValue, oldValue) => {
        if (newValue == true) {
          switch (direction.value) {
            case "left":
              speechSynthesis.cancel()
              speechSynthesis.speak(
                new SpeechSynthesisUtterance(
                  `Cancelling. Tap again at any time to retry.`,
                ),
              )
              showSpeechDialog.value = false
              break
            case "right":
              speechSynthesis.cancel()
              showSpeechDialog.value = false
              await navigateTo(`/navigation/${normalizedResult}`)
          }
        }
      },
      { once: true },
    )
  } else if (normalizedResult == "yes") {
  } else if (normalizedResult == "no") {
    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        `Cancelling. Tap again at any time to retry.`,
      ),
    )
    showSpeechDialog.value = false
  } else if (normalizedResult == "home") {
    await navigateTo("")
    showSpeechDialog.value = false
  } else {
    speechSynthesis.speak(
      new SpeechSynthesisUtterance(`No room found. Tap again to retry.`),
    )
    showSpeechDialog.value = false
  }
}

const mainContainer = useTemplateRef("main-container")

const { isSwiping, direction } = useSwipe(mainContainer)
</script>
<template>
  <NuxtRouteAnnouncer />
  <div ref="main-container">
    <div
      class="bg-[var(--black-color)] h-screen text-white flex flex-col justify-between"
      @click="handleToggleListeningDialog"
    >
      <NuxtPage />
      <div
        class="h-24 bg-[var(--turq-color)] flex py-4 items-end justify-center"
      >
        <Button
          rounded
          variant="outlined"
          class="!border-8 text-9xl rounded-full"
          :class="
            isListening
              ? 'border-[var(--red-color)] text-[var(--red-color)] bg-[var(--black-color)] '
              : 'border-[var(--blue-color)] text-[var(--blue-color)] bg-white '
          "
        >
          <Icon name="fluent:mic-28-filled" class="rounded-full" />
        </Button>
      </div>
    </div>
    <Dialog
      v-model:visible="showSpeechDialog"
      @hide="handleStopListening"
      class="w-[80vw] min-h-[70vh]"
    >
      <div class="flex flex-col gap-4">
        <h2 class="text-3xl font-semibold">Listening...</h2>
        <p v-if="!speech.isFinal.value" class="text-2xl">
          {{ speech.result.value }}
        </p>
        <div v-else class="flex flex-col gap-2">
          <p class="text-2xl">
            {{ selectedRoom?.displayName }}
          </p>
          <strong class="text-2xl">Is this correct?</strong>

          <div class="bg-[var(--blue-color)] text-white p-8 rounded-lg">
            <span>Swipe right to confirm</span>
          </div>
          <div class="bg-[var(--red-color)] text-white p-8 rounded-lg">
            <span>Swipe left to cancel</span>
          </div>
          <span class="text-2xl">or say "yes" or "no"</span>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<style lang="scss">
@import "primeicons/primeicons.css";
@import url("https://fonts.googleapis.com/css2?family=Readex+Pro:wght@160..700&display=swap");

:root {
  --black-color: #0d090b;
  --turq-color: #27b0c8;
  --blue-color: #6252f0;
  --red-color: #fe3d3d;
}

html {
  font-family: "Readex Pro";
}
</style>
