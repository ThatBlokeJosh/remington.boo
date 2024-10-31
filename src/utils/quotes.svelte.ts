import type { Quote } from "./types"
import * as q from "../texts/quotes.json"
import { english } from "./stores.svelte"
import { get } from "svelte/store"

let quotes: Quote[]; 
let queue: Quote[]; 

english.subscribe((e) => {
  console.log(quotes, queue, e)
  quotes = e ? q["english"]["quotes"] : q["czech"]["quotes"]
  queue = Array.from(quotes)
})

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getQuote(mount: boolean = false): Quote {
  let r = mount ? 0 : rand(0, queue.length)  
  let quote = queue[r]
  queue.splice(r, 1)

  if (queue.length === 0) {
    queue = Array.from(quotes)
  }

  return quote
}
