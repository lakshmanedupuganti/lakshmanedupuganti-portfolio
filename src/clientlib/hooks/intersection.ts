"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentState, IntersectParams } from "@lib/types";
import { observe } from "@clientlib/utility/viewportObserver";

type UseIntersectionInternalData = {
  visible: boolean;
  element: Element | null;
  rootMargin: string;
  disabled: boolean;
  unobserve: (() => void) | null;
  stopAfterFirstVisible: boolean;
  stopped: boolean;
};

const useIntersectionInternalHelper = (
  setVisible: (v: boolean) => void,
  rootMargin: string,
  disabled: boolean,
  stopAfterFirstVisible: boolean = false
): ((el: Element | null) => void) => {
  const data = useRef<UseIntersectionInternalData>({
    visible: false,
    element: null,
    rootMargin,
    disabled,
    unobserve: null,
    stopAfterFirstVisible,
    stopped: false,
  });

  const process = () => {
    const { element, rootMargin, disabled, stopped, stopAfterFirstVisible } =
      data.current;

    // no longer used
    if (stopped) return;

    const unhook = () => {
      if (data.current.unobserve) {
        try {
          data.current.unobserve();
        } catch (e) {}
        data.current.unobserve = null;
      }
    };

    // first clean up the previous observe
    unhook();

    if (element) {
      data.current.unobserve = observe(
        element,
        (isVisible) => {
          data.current.visible = isVisible;
          if (!disabled) {
            setVisible(isVisible);
            if (isVisible && stopAfterFirstVisible) {
              data.current.stopped = true;
              unhook();
            }
          }
        },
        { rootMargin }
      );
    }
  };

  const setRef: (el: Element | null) => void = useCallback((el) => {
    if (el === data.current.element) return;
    data.current.element = el;
    process();
  }, []);

  useEffect(() => {
    data.current.disabled = disabled;
    process();
  }, [disabled]);

  return setRef;
};

// root margin in rootMargin after the initial value will not be taken into account
export const useIntersectionInternal = (
  rootMargin: string,
  disabled: boolean,
  stopAfterFirstVisible: boolean = false
): [(el: Element | null) => void, boolean] => {
  const [visible, setVisible] = useState(false);

  const setRef = useIntersectionInternalHelper(
    setVisible,
    rootMargin,
    disabled,
    stopAfterFirstVisible
  );

  return [setRef, visible];
};

type DocumentStateDelayData = {
  interactiveTime: Date;
  documentState: DocumentState;
  delayMilliseconds: number;
  disabled: boolean;
  completedTime?: Date;
  timeoutId?: number;
  status: boolean;
};

const useDocumentStateDelayHelper = (
  status: boolean,
  setStatus: (v: boolean) => void,
  documentState: DocumentState = "complete",
  delayMilliseconds = 0,
  disabled = false
) => {
  const documentStateDelayData = useRef<DocumentStateDelayData>({
    interactiveTime: new Date(), // interactive status is already reached
    delayMilliseconds,
    documentState,
    disabled,
    status,
  });

  const process = () => {
    // hide the values coming from the hook params
    const {
      disabled,
      documentState,
      delayMilliseconds,
      interactiveTime,
      completedTime,
      status,
    } = documentStateDelayData.current;

    // check and clear timeout if we have one before doing anything else
    if (documentStateDelayData.current.timeoutId) {
      clearTimeout(documentStateDelayData.current.timeoutId);
      documentStateDelayData.current.timeoutId = undefined;
    }

    // if the state is already set, nothing to do - return
    if (status) return;

    if (!disabled) {
      const checkTime =
        documentState === "interactive" ? interactiveTime : completedTime;
      // we don't have the check time - return
      if (!checkTime) return;

      const now = new Date();
      // check if the delay has passed and set the final state
      const diffMilliseconds = now.getTime() - checkTime.getTime();
      if (diffMilliseconds > delayMilliseconds) {
        documentStateDelayData.current.status = true;
        setStatus(true);
        return;
      }

      documentStateDelayData.current.timeoutId = Number(
        setTimeout(() => {
          documentStateDelayData.current.status = true;
          setStatus(true);
        }, delayMilliseconds - diffMilliseconds)
      );
    }
  };

  useEffect(() => {
    if (document.readyState !== "complete") {
      const listener = () => {
        if (document.readyState === "complete") {
          documentStateDelayData.current.completedTime = new Date();
          process();
        }
      };
      document.addEventListener("readystatechange", listener);
      return () => {
        document.removeEventListener("readystatechange", listener);
      };
    } else {
      // the state may have changed to completed between the time of the inital state and the execution of the effect
      if (document.readyState === "complete") {
        documentStateDelayData.current.completedTime = new Date();
        process();
      }
    }
  }, []);

  // capture changes in the disabled flag
  useEffect(() => {
    documentStateDelayData.current.disabled = disabled;
    process();
  }, [disabled]);
};

// changes in documentState and delayMilliseconds will not be reflected in the returned value
export const useDocumentStateDelay = (
  documentState: DocumentState = "complete",
  delayMilliseconds = 0,
  disabled = false
) => {
  const [status, setStatus] = useState<boolean>(() => {
    // assume the state is already reached
    if (
      typeof document !== "undefined" &&
      document.readyState === documentState &&
      delayMilliseconds < 10
    )
      return true;

    return false;
  });

  useDocumentStateDelayHelper(
    status,
    setStatus,
    documentState,
    delayMilliseconds,
    disabled
  );
  return status;
};

declare type IntersectType<T extends Element> = (
  parms: IntersectParams
) => [(element: T | null) => void, boolean];

export const useIntersectionAndDocumentStateDelay = <T extends Element>(
  parms: IntersectParams
): [(element: T | null) => void, boolean] => {
  const { rootMargin, disabled, documentState, delayMilliseconds } = parms;

  const data = useRef<{ intersected: boolean; docLoaded: boolean }>({
    intersected: false,
    docLoaded:
      typeof document !== "undefined" &&
      document.readyState === documentState &&
      delayMilliseconds < 10,
  });

  const [visible, setVisible] = useState<boolean>(false);

  const setIntersected = (v: boolean) => {
    data.current.intersected = v;
    if (v && data.current.docLoaded) setVisible(true);
  };
  const setLoaded = (v: boolean) => {
    data.current.docLoaded = v;
    if (v && data.current.intersected) setVisible(true);
  };

  const setRef = useIntersectionInternalHelper(
    setIntersected,
    rootMargin,
    disabled,
    true
  );

  useDocumentStateDelayHelper(
    data.current.docLoaded,
    setLoaded,
    documentState,
    delayMilliseconds,
    disabled
  );

  return [setRef, visible];
};

interface ComponentHolder<T> {
  component: T;
}

export const useDynamicComponent = <T extends any>(
  canLoad: boolean,
  importFunc: () => Promise<T>
): T | null => {
  const [holder, setHolder] = useState<ComponentHolder<T> | null>(null);
  const compLoadedRef = useRef(false);

  useEffect(() => {
    if (canLoad && !compLoadedRef.current) {
      const loadComp = async () => {
        const component: T = await importFunc();
        compLoadedRef.current = true;
        setHolder({ component });
      };
      loadComp();
    }
  }, [canLoad]);

  return holder?.component || null;
};

declare type IntersectParamsWithLoader<T> = IntersectParams & {
  importFunc: () => Promise<T>;
};

export const useDynamicComponentOnIntersectionAndDocumentStateEvent = <
  T extends Element,
  C extends any,
>(
  parms: IntersectParamsWithLoader<C>
): [(element: T | null) => void, C | null] => {
  const [setRef, isIntersected] =
    useIntersectionAndDocumentStateDelay<T>(parms);

  const Comp = useDynamicComponent<C>(isIntersected, parms.importFunc);

  return [setRef, Comp];
};

export const useDynamicComponentOnDocumentStateEvent = <C extends any>(
  parms: Omit<IntersectParamsWithLoader<C>, "rootMargin">
): C | null => {
  const visible = useDocumentStateDelay(
    parms.documentState,
    parms.delayMilliseconds
  );

  const Comp = useDynamicComponent<C>(visible, parms.importFunc);

  return Comp;
};
