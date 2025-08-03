import { useCallback } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";

interface PromptRef<T = unknown> {
  resolve: ((value: T | PromiseLike<T>) => void) | null;
  reject: ((reason?: unknown) => void) | null;
}

export type PromptCallback<T = unknown, R = unknown> = (
  value?: T | null
) => Promise<R>;

export default function usePrompt<T = unknown, R = unknown>() {
  const ref = useRef<PromptRef<R>>({
    resolve: null,
    reject: null,
  });

  const [value, setValue] = useState<T | null>(null);
  const [show, setShow] = useState(false);

  const prompt: PromptCallback<T, R> = useCallback(
    (value = null) =>
      new Promise((resolve, reject) => {
        ref.current = {
          resolve,
          reject,
        };
        setValue(value);
        setShow(true);
      }),
    []
  );

  const resolve = useCallback((value: R) => ref.current.resolve?.(value), []);
  const reject = useCallback(
    (value: unknown) => ref.current.reject?.(value),
    []
  );

  return useMemo(
    () => ({ show, value, setShow, prompt, resolve, reject }),
    [show, value, setShow, prompt, resolve, reject]
  );
}
