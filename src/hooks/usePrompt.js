import { useCallback } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function usePrompt() {
  const ref = useRef({
    resolve: null,
    reject: null,
  });

  const [value, setValue] = useState(null);
  const [show, setShow] = useState(false);

  const prompt = useCallback(
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

  const resolve = useCallback((value) => ref.current.resolve?.(value), []);
  const reject = useCallback((value) => ref.current.reject?.(value), []);

  return useMemo(
    () => ({ show, value, setShow, prompt, resolve, reject }),
    [show, value, setShow, prompt, resolve, reject]
  );
}
