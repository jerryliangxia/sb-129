import * as THREE from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useGame = /* @__PURE__ */ create(
  /* @__PURE__ */ subscribeWithSelector<State>((set, get) => {
    return {
      isTouchScreen: false,
      setIsTouchScreen: (isTouchScreen: boolean) => {
        set(() => ({ isTouchScreen: isTouchScreen }));
      },

      // Canvas
      overlayVisible: true,
      setOverlayVisible(visible) {
        set(() => ({ overlayVisible: visible }));
      },

      isFullScreen: false,
      setIsFullScreen: (isFullScreen: boolean) => {
        set(() => ({ isFullScreen: isFullScreen }));
      },

      // Game Stages
      gameStage: 0 as number,
      setGameStage: (stage: number) => {
        set(() => ({ gameStage: stage }));
      },
      getGameStage: () => {
        return get().gameStage;
      },

      /**
       * Point to move point
       */
      moveToPoint: null as THREE.Vector3,

      /**
       * Check is camera based movement
       */
      isCameraBased: false as boolean,

      /**
       * Character animations state manegement
       */
      // Initial animation
      curAnimation: null as string,
      setCurAnimation: (animation: string) => {
        set((state) => {
          return { curAnimation: animation };
        });
      },
      animationSet: {} as AnimationSet,

      curHealth: 10,
      setCurHealth: (health: number) => {
        set((state) => {
          return { ...state, curHealth: health };
        });
      },

      curPosition: null as THREE.Vector3,
      curDirection: null as THREE.Vector3,

      setCurPosition: (position: THREE.Vector3) => {
        set((state) => {
          return { ...state, curPosition: position };
        });
      },

      setCurDirection: (direction: THREE.Vector3) => {
        set((state) => {
          return { ...state, curDirection: direction };
        });
      },

      /**
       * Get the current position and direction; needed since EnemyEntity requires it
       */
      getCurPosition: () => {
        return get().curPosition;
      },

      getCurDirection: () => {
        return get().curDirection;
      },

      initializeAnimationSet: (animationSet: AnimationSet) => {
        set((state) => {
          if (Object.keys(state.animationSet).length === 0) {
            return { animationSet };
          }
          return { animationSet: animationSet };
        });
      },

      reset: () => {
        set((state) => {
          return { curAnimation: state.animationSet.idle };
        });
      },

      idle: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.jumpIdle) {
            return { curAnimation: state.animationSet.jumpLand };
          } else if (
            state.curAnimation !== state.animationSet.action1 &&
            state.curAnimation !== state.animationSet.action2 &&
            state.curAnimation !== state.animationSet.action3 &&
            state.curAnimation !== state.animationSet.action4 &&
            state.curAnimation !== state.animationSet.action7
          ) {
            return { curAnimation: state.animationSet.idle };
          }
          return {};
        });
      },

      walk: () => {
        set((state) => {
          if (
            (state.curAnimation !== state.animationSet.action7 &&
              state.curAnimation !== state.animationSet.action4) ||
            (state.curAnimation !== state.animationSet.action1 &&
              get().isTouchScreen)
          ) {
            return { curAnimation: state.animationSet.walk };
          }
          return {};
        });
      },

      run: () => {
        set((state) => {
          if (
            (state.curAnimation !== state.animationSet.action7 &&
              state.curAnimation !== state.animationSet.action4) ||
            (state.curAnimation !== state.animationSet.action1 &&
              get().isTouchScreen)
          ) {
            return { curAnimation: state.animationSet.run };
          }
          return {};
        });
      },

      jump: () => {
        set((state) => {
          return { curAnimation: state.animationSet.jump };
        });
      },

      jumpIdle: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.jump) {
            return { curAnimation: state.animationSet.jumpIdle };
          }
          return {};
        });
      },

      jumpLand: () => {
        set((state) => {
          if (state.curAnimation === state.animationSet.jumpIdle) {
            return { curAnimation: state.animationSet.jumpLand };
          }
          return {};
        });
      },

      fall: () => {
        set((state) => {
          return { curAnimation: state.animationSet.fall };
        });
      },

      action1: () => {
        if (get().curHealth <= 0) return;
        set((state) => {
          if (
            state.curAnimation === state.animationSet.idle ||
            state.curAnimation === state.animationSet.walk ||
            state.curAnimation === state.animationSet.run
          ) {
            return { curAnimation: state.animationSet.action1 };
          }
          return {};
        });
      },

      action2: () => {
        if (get().curHealth <= 0) return;
        set((state) => {
          if (state.curAnimation === state.animationSet.idle) {
            return { curAnimation: state.animationSet.action2 };
          }
          return {};
        });
      },

      action3: () => {
        if (get().curHealth <= 0) return;
        set((state) => {
          if (state.curAnimation === state.animationSet.idle) {
            return { curAnimation: state.animationSet.action3 };
          }
          return {};
        });
      },

      action4: () => {
        if (get().curHealth <= 0) return;
        set((state) => {
          if (
            state.curAnimation === state.animationSet.idle ||
            state.curAnimation === state.animationSet.walk ||
            state.curAnimation === state.animationSet.run
          ) {
            return { curAnimation: state.animationSet.action4 };
          }
          return {};
        });
      },

      // Fall and death animations - don't need health check
      action5: () => {
        set((state) => {
          return { curAnimation: state.animationSet.action5 };
        });
      },

      action6: () => {
        set((state) => {
          return { curAnimation: state.animationSet.action6 };
        });
      },

      // Shoot animation
      action7: () => {
        if (get().curHealth <= 0) return;
        set((state) => {
          if (
            state.curAnimation === state.animationSet.idle ||
            state.curAnimation === state.animationSet.walk ||
            state.curAnimation === state.animationSet.run
          ) {
            return { curAnimation: state.animationSet.action7 };
          }
          return {};
        });
      },

      /**
       * Additional animations
       */
      // triggerFunction: ()=>{
      //    set((state) => {
      //        return { curAnimation: state.animationSet.additionalAnimation };
      //    });
      // }

      /**
       * Set/get point to move point
       */
      setMoveToPoint: (point: THREE.Vector3) => {
        set(() => {
          return { moveToPoint: point };
        });
      },

      getMoveToPoint: () => {
        return {
          moveToPoint: get().moveToPoint,
        };
      },

      /**
       * Set/get camera based movement
       */
      setCameraBased: (isCameraBased: boolean) => {
        set(() => {
          return { isCameraBased: isCameraBased };
        });
      },

      getCameraBased: () => {
        return {
          isCameraBased: get().isCameraBased,
        };
      },
    };
  })
);

export type AnimationSet = {
  idle?: string;
  walk?: string;
  run?: string;
  jump?: string;
  jumpIdle?: string;
  jumpLand?: string;
  fall?: string;
  // Currently support four additional animations
  action1?: string;
  action2?: string;
  action3?: string;
  action4?: string;
  action5?: string;
  action6?: string;
  action7?: string;
};

type State = {
  isTouchScreen: boolean;
  setIsTouchScreen: (isTouchScreen: boolean) => void;
  overlayVisible: boolean;
  setOverlayVisible: (visible: boolean) => void;
  isFullScreen: boolean;
  setIsFullScreen: (isFullScreen: boolean) => void;
  gameStage: number;
  setGameStage: (stage: number) => void;
  getGameStage: () => number;
  moveToPoint: THREE.Vector3;
  isCameraBased: boolean;
  curAnimation: string;
  setCurAnimation: (animation: string) => void;
  curHealth: number;
  setCurHealth: (health: number) => void;
  curPosition: THREE.Vector3;
  curDirection: THREE.Vector3;
  setCurPosition: (position: THREE.Vector3) => void;
  setCurDirection: (direction: THREE.Vector3) => void;
  getCurPosition: () => THREE.Vector3;
  getCurDirection: () => THREE.Vector3;
  animationSet: AnimationSet;
  initializeAnimationSet: (animationSet: AnimationSet) => void;
  reset: () => void;
  setMoveToPoint: (point: THREE.Vector3) => void;
  getMoveToPoint: () => {
    moveToPoint: THREE.Vector3;
  };
  setCameraBased: (isCameraBased: boolean) => void;
  getCameraBased: () => {
    isCameraBased: boolean;
  };
} & {
  [key in keyof AnimationSet]: () => void;
};
