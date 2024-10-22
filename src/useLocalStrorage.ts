import { useEffect, useState } from "react";

// localStorage hook
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  // check if the value exit
const [value, setvalue] = useState<T>(() => {
  const jsonValue = localStorage.getItem(key)
  if(jsonValue == null){
    if(typeof initialValue === "function") {
      return (initialValue as () => T)()
    } else {
      return initialValue
    }
  } else {
    return JSON.parse(jsonValue)
  }
})

// update every time we change it
useEffect(() => {
  localStorage.setItem(key, JSON.stringify(value))
}, [value, key])

return [value, setvalue] as [T, typeof setvalue]
}