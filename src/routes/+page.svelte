<script lang="ts">
  import * as t from "../texts/texts.json"
  import { onMount } from "svelte";
  import {getQuote} from "../utils/quotes.svelte" 
  import { fly} from "svelte/transition";
  import type { Quote } from "../utils/types";
  import { LoadLS, SaveLS } from "../utils/localStorage.svelte";
  import { english } from "../utils/stores.svelte";


  let message: Quote = $state({message: ""})
  let mounted = $state(false)

  let timeouts = []
  let delTimeout = setTimeout(() => {}, 0)

  let typing = false

  function type(mount: boolean = false) {
    let quote = getQuote(mount);
    typing = true
    for (let i = 0; i < quote.message.length; i++) {
      let timeout = setTimeout(() => {
        if (!typing) {
          return;
        }
        message.message += quote.message[i]
        if (quote.message.length - 1 === i) {
          if (mount) {
            mounted = true
          }
          typing = false
          delTimeout = setTimeout(() => {
            del()
            delTimeout = undefined
          }, 5000)
        }
      }, 75 * i) 
      timeouts.push(timeout)
    } 
  }

  function del() {
    let quote = message.message
    for (let i = 0; i < quote.length; i++) {
      setTimeout(() => {
        let t = message.message.split("")
        t.pop()
        message.message = t.join("")
        if (quote.length - 1 === i) {
          setTimeout(() => {
            type(!mounted)
          }, 500)
        }
      }, 50 * i) 
    } 
  }

  onMount(() => {
    let lang = LoadLS()
    $english = lang === "en" || lang === null
    setTimeout(() => {
      type(true)
    }, 500)
  })

  let texts = $derived($english ? t["english"] : t["czech"]) 

  function ToggleTranslate() {
    $english = !$english
    SaveLS($english ? "en" : "cz")
    if (typing) {
      typing = false
      timeouts.forEach(t => {
        clearTimeout(t)
      })
      del()
    } else if (delTimeout) {
      clearTimeout(delTimeout)
      delTimeout = undefined
      del()
    }
  }
</script>

{#if $english != undefined}
  <div transition:fly={{duration: 500}} class="p-[5vh] md:p-[5vw] w-[100vw] h-[100vh] overflow-hidden">
    <div class="grid">
      <div class="w-full flex justify-between">
        <p class="text-3xl md:text-4xl">{texts.quotes.title}</p>
        <button onclick={ToggleTranslate} class="text-orange-500 underline font-bold italic text-xl md:text-2xl">
            {$english ? "do češtiny" : "to english"}
        </button>
      </div>
      <h1 class="pointer-events-none quote h-full w-fit flex text-6xl sm:text-9xl bg-transparent mb-[3vh] break-words">
        {message.message}
      </h1>
    </div>
  </div>

  <div class="absolute right-0 bottom-0 flex items-center justify-center md:justify-between text-center p-[5vh] md:p-[5vw] w-[100vw]">
    {#if mounted}
      <p class="text-xl sm:text-2xl" in:fly={{duration:500, delay: 200}} >
        {texts.footer.start_text} <a href={texts.footer.cv.link} class="text-orange-500 italic font-bold">{texts.footer.cv.anchor_text}</a> {texts.footer.half_text}
        <a class="text-orange-500 italic font-bold" href={texts.footer.github.link}>{texts.footer.github.text}</a>
      </p>
    {/if}
  </div>
{/if}

<style>
</style>
