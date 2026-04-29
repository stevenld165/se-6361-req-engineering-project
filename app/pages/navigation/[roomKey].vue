<script setup lang="ts">
import { useSwipe } from "@vueuse/core"
import { NavStepType, validRooms } from "~/consts"

const route = useRoute()

console.log(route.params.roomKey)

const room = validRooms.get(route.params.roomKey as string)
const currentStep = ref(0)

const eta = computed(
  () => room?.navigationSteps.length! - currentStep.value - 1,
)

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(() => {
  speechSynthesis.cancel()
  playAnimation()
})

const playAnimation = async () => {
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(
      `Navigating to ${room?.displayName}. Estimated to take ${eta.value} minutes.`,
    ),
  )

  await pause(5000)

  while (currentStep.value < (room?.navigationSteps.length ?? -1) - 1) {
    const step = room?.navigationSteps[currentStep.value]

    if (step == null) return

    console.log("Current step: ", step.direction)

    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        `${step.direction} ${step.distance > 0 ? "for " + step.distance + " feet" : ""}`,
      ),
    )

    if (step.type == NavStepType.FALL) {
      await pause(2000)
      speechSynthesis.cancel()
      showEmergencyDialog.value = true

      speechSynthesis.speak(
        new SpeechSynthesisUtterance(
          `Fall detected. Contacting emergency contact: 945-248-7589. Swipe left or say cancel to cancel`,
        ),
      )

      watch(
        isSwiping,
        async (newValue, oldValue) => {
          if (newValue == true) {
            switch (direction.value) {
              case "left":
                showEmergencyDialog.value = false
                speechSynthesis.cancel()
                break
            }
          }
        },
        { once: true },
      )

      await pause(5000)
    }

    if (step.type == NavStepType.OBSTACLE) {
      await pause(2000)
      speechSynthesis.cancel()
      showObstacleDialog.value = true

      speechSynthesis.speak(
        new SpeechSynthesisUtterance(
          `Obstacle detected. Please wait for the obstacle to pass`,
        ),
      )
      await pause(6000)

      speechSynthesis.speak(
        new SpeechSynthesisUtterance("Obstacle clear, resuming navigation"),
      )

      showObstacleDialog.value = false
    }

    await pause(step.duration)

    currentStep.value++
  }

  speechSynthesis.speak(new SpeechSynthesisUtterance("Destination Reached!"))
}

const showEmergencyDialog = ref(false)
const showObstacleDialog = ref(false)

const emergencyDialog = useTemplateRef("emergency-container")

const { isSwiping, direction } = useSwipe(emergencyDialog)
</script>
<template>
  <div class="px-12 py-24" ref="emergency-container">
    <div>
      <h2 class="text-4xl font-bold">Navigating to {{ room?.displayName }}</h2>
      <p class="text-2xl">ETA: 2:54 PM ({{ eta }} mins)</p>
      <div
        class="mt-4 flex flex-col gap-4"
        v-if="room!.navigationSteps.length > 0"
      >
        <NavigationStepCard
          active
          :step="room!.navigationSteps[currentStep]!"
        />
        <template v-if="room?.navigationSteps.length ?? 0 > currentStep + 1">
          <NavigationStepCard :step="room!.navigationSteps[currentStep + 1]" />
        </template>
      </div>
    </div>
    <Dialog
      class="bg-[var(--red-color)] text-white w-[80vw]"
      v-model:visible="showEmergencyDialog"
    >
      <div class="flex flex-col gap-4">
        <h2 class="font-bold text-3xl">Fall detected!</h2>
        <strong class="text-xl"
          >Contacting emergency contact: (945) 248-7589</strong
        >
        <div class="m-auto p-4 text-3xl bg-black rounded-full w-min">10</div>
        <p>Swipe left or say "cancel" to cancel</p>
      </div>
    </Dialog>
    <Dialog
      class="bg-[var(--red-color)] text-white w-[80vw]"
      v-model:visible="showObstacleDialog"
    >
      <div class="flex flex-col gap-4">
        <h2 class="font-bold text-3xl">Moving Obstacle detected!</h2>
        <img src="/obstacle.png" class="rounded-xl" />
        <p>Please wait for the obstacle to pass</p>
      </div>
    </Dialog>
  </div>
</template>
<style lang="scss" scoped></style>
