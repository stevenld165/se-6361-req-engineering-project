export interface Room {
  displayName: string
  navigationSteps: NavStep[]
}

export enum NavStepType {
  NORMAL,
  OBSTACLE,
  FALL,
}

export interface NavStep {
  direction: string
  icon: string
  duration: number
  distance: number
  type: NavStepType
}

export const validRooms = new Map<string, Room>()

validRooms.set("ecss2304", {
  displayName: "ECSS 2.304",
  navigationSteps: [
    {
      direction: "Walk forward",
      icon: "famicons:arrow-up",
      duration: 5000,
      distance: 20,
      type: NavStepType.NORMAL,
    },
    {
      direction: "Turn left",
      icon: "famicons:arrow-back",
      duration: 5000,
      distance: 0,
      type: NavStepType.NORMAL,
    },
    {
      direction: "Walk forward",
      icon: "famicons:arrow-up",
      duration: 5000,
      distance: 12,
      type: NavStepType.OBSTACLE,
    },
    {
      direction: "Turn right into ECSS 2.304",
      icon: "famicons:arrow-forward",
      duration: 5000,
      distance: 0,
      type: NavStepType.FALL,
    },
    {
      direction: "Destination Reached!",
      icon: "jam:map-marker",
      duration: 5000,
      distance: 0,
      type: NavStepType.NORMAL,
    },
  ],
})

validRooms.set("gr3125", {
  displayName: "GR 3.125",
  navigationSteps: [
    {
      direction: "Turn right",
      icon: "famicons:arrow-forward",
      duration: 2500,
      distance: 0,
      type: NavStepType.NORMAL,
    },
    {
      direction: "Walk forward",
      icon: "famicons:arrow-up",
      duration: 7000,
      distance: 25,
      type: NavStepType.NORMAL,
    },
    {
      direction: "Turn left",
      icon: "famicons:arrow-back",
      duration: 3000,
      distance: 0,
      type: NavStepType.NORMAL,
    },
    {
      direction: "Walk forward",
      icon: "famicons:arrow-up",
      duration: 10000,
      distance: 30,
      type: NavStepType.NORMAL,
    },
    {
      direction: "Turn left into GR 3.125",
      icon: "famicons:arrow-back",
      duration: 3000,
      distance: 0,
      type: NavStepType.NORMAL,
    },
    {
      direction: "Destination Reached!",
      icon: "jam:map-marker",
      duration: 5000,
      distance: 0,
      type: NavStepType.NORMAL,
    },
  ],
})
