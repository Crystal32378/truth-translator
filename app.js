      const DEMOS = [
        {
          id: "anthropic",
          title: "Anthropic 聲明",
          input: "The US government has issued an export control directive to suspend all access to Fable 5 and Mythos 5. The letter did not provide specific details of its national security concern. We reviewed a demonstration of this specific technique being used to identify a small number of previously known, minor vulnerabilities. These vulnerabilities all appear relatively simple, and other publicly-available models are able to discover them as well, including GPT-5.5. We are complying with the government’s legal directive. However, we disagree that the finding of a narrow potential jailbreak should be cause for recalling a commercial model deployed to hundreds of millions of people.",
          output: {
            human: "政府突然叫我們下架。理由不清楚，我們覺得站不住腳，但只能先照辦。",
            subtext: "GPT-5.5 也做得到，為什麼只封我？",
            belief: "這次不是 Fable 特別危險，是政府反應過度。",
            meme: "不爽，但得照做。",
            nuclear: "GPT-5.5 也能讀程式碼修 bug。Gemini、Llama 也能。所以要嘛一起抓，要嘛承認你只是在針對我。",
            label: "官方聲明",
            confidence: 92,
            read: "防守型聲明",
            signals: ["被迫配合", "淡化風險", "把爭議轉成程序問題"]
          }
        },
        {
          id: "couple",
          title: "夫妻吵架",
          input: "沒關係，你開心就好。",
          output: {
            human: "有關係，而且我不開心。",
            subtext: "你現在最好自己想清楚。",
            belief: "我希望你知道你踩線了，但我不想先爆炸。",
            meme: "戰爭已經開始，只是你還沒收到通知。",
            nuclear: "你說沒事，但你的語氣、已讀速度、回覆字數都在開庭。所以問題不是我聽不懂，是你不想直接講。",
            label: "關係訊息",
            confidence: 96,
            read: "高壓低溫",
            signals: ["字面讓步", "情緒壓住", "要求對方自行補考"]
          }
        },
        {
          id: "consulting",
          title: "顧問話",
          input: "目前市場採用速度低於預期，但也提供了重新審視價值主張與目標客群定位的重要契機。",
          output: {
            human: "沒人買。",
            subtext: "原本想的市場可能不存在。",
            belief: "這不是失敗，是一場寶貴的學習。拜託大家不要追殺我。",
            meme: "50頁簡報濃縮：賣不動。",
            nuclear: "你把『沒人買』包裝成市場教育。那請問市場到底學會了什麼？學會不要買嗎？",
            label: "商務包裝",
            confidence: 89,
            read: "簡報止血",
            signals: ["抽象名詞過多", "把壞消息改寫成策略調整", "避免承認需求不足"]
          }
        },
        {
          id: "alumni",
          title: "校友會公告",
          input: "我們將持續蒐集各方意見，並於適當時機再行討論。",
          output: {
            human: "先不做。",
            subtext: "現在不想表決，也不想負責。",
            belief: "我們很民主，只是暫時不會有結論。",
            meme: "不會過，但會拖得很有禮貌。",
            nuclear: "你說適當時機再討論。請問適當時機是什麼時候？等到所有人忘記這件事嗎？",
            label: "組織公告",
            confidence: 84,
            read: "禮貌型拖延",
            signals: ["沒有期限", "移到未來討論", "責任被分散"]
          }
        }
      ];

      const RULES = [
        { keys: ["沒關係", "你開心就好", "隨便你"], label: "關係訊息", read: "高壓低溫", out: ["有關係，而且我不開心。", "你最好自己想清楚。", "我希望你知道你踩線了。", "戰爭已經開始，只是你還沒收到通知。", "你說沒事，但你的語氣、已讀速度、回覆字數都在開庭。所以問題不是我聽不懂，是你不想直接講。"] },
        { keys: ["not the right fit", "not a fit", "unfortunately", "moving forward with other candidates"], label: "拒絕信", read: "禮貌型關門", out: ["不投 / 不錄取。", "你不符合我們現在想要的條件。", "不是你不好，是我們不想把話說死。", "好人卡，商務版。", "你說不契合，但你投過更亂的案子。所以不是不契合，是你不敢承認你不信。"] },
        { keys: ["市場採用速度", "價值主張", "目標客群", "重新審視", "product-market fit"], label: "商務包裝", read: "簡報止血", out: ["沒人買。", "原本想的市場可能不存在。", "這不是失敗，是學習。拜託不要追殺我。", "50頁簡報濃縮：賣不動。", "你把『沒人買』包裝成市場教育。那請問市場到底學會了什麼？學會不要買嗎？"] },
        { keys: ["黑客馬拉松", "黑客松", "hackathon", "金主", "贊助", "加速器", "投資人", "場地", "餐飲贊助"], label: "活動募資", read: "召喚乾爹乾媽", out: ["我要辦一場很大、很酷、很燒錢的活動，現在開始找人一起出錢出場地出資源。", "1. 全球同步 = 規模聽起來要很大\n2. 正要籌備 = 目前很多東西還沒著落\n3. 推薦金主 = 我需要人脈、預算、場地、曝光跟食物，最好昨天就到位", "請相信這不是我一個人在冒險，這是大家一起參與 AI 時代的歷史現場。順便一起分攤成本。", "翻譯：我要辦黑客松，現在缺錢、缺場、缺飯、缺曝光、缺投資人，但不缺夢想。", "Codex 準備全球同步黑客松，聽起來像科技盛會；實際翻譯：我現在需要加速器當門面、投資人當乾爹、場地商當房東、行銷人當擴音器、餐飲贊助商負責讓工程師不要餓到寫出靈異程式。"] },
        { keys: ["返校日", "綠T", "T-shirt", "入校識別", "售完為止", "不再加售", "學校人力有限"], label: "活動公告", read: "T 恤型門票控管", out: ["沒買到綠 T，就不要來。", "學校人手不夠，所以我們把入場資格包裝成衣服問題。", "請相信這不是主辦方控量或溝通太晚，而是為了大家安全。", "翻譯：T-shirt 不是紀念品，是校門口通行證。沒衣服，沒入場。", "你說專屬 T-shirt 是入校識別。那它到底是紀念商品、制服、門票，還是校園版簽證？售完不加售的意思是：安全是有限量的嗎？"] },
        { keys: ["蒐集更多意見", "再行討論", "適當時機", "持續研議"], label: "組織公告", read: "禮貌型拖延", out: ["先不做。", "現在不想表決。", "我們很民主，只是暫時不會有結論。", "不會過，但會拖得很有禮貌。", "你說適當時機再討論。請問適當時機是什麼時候？等到所有人忘記這件事嗎？"] },
        { keys: ["審慎樂觀", "長期發展", "短期挑戰", "macro headwinds"], label: "財報語氣", read: "短痛長餅", out: ["現在不太妙。", "短期很痛，長期先畫餅。", "希望你不要只看現在的慘況。", "目前很慘，但我們還沒死。", "你說長期發展值得期待，是因為短期數字真的不能看。長期不是策略，是遮羞布。"] },
        { keys: ["complying", "disagree", "directive", "government", "legal directive", "安全", "風險", "危險"], label: "官方聲明", read: "防守型聲明", out: ["被迫照辦，但不服。", "你有權力，我有意見。", "我們希望大家覺得這次不是我們的錯。", "不爽，但得照做。", "你說它危險。那同樣標準套到其他模型身上也成立。怎麼不一起禁？"] },
        { keys: ["continue to monitor", "monitor the situation", "密切關注", "持續觀察"], label: "危機回應", read: "觀望但不能說沒招", out: ["我們也還不知道怎麼辦。", "先看風向。", "我們正在假裝有掌握狀況。", "觀察中，翻譯：沒招。", "你說密切關注，是因為現在沒有解法。關注不是行動，是等待別人先出事。"] }
      ];

      const input = document.querySelector("#input");
      const count = document.querySelector("#count");
      const results = document.querySelector("#results");
      const toast = document.querySelector("#toast");
      let currentOutput = null;

      function showToast(text) {
        toast.textContent = text;
        toast.hidden = false;
        setTimeout(() => { toast.hidden = true; }, 1600);
      }

      function getSignals(text, rule) {
        const signals = [];
        const lower = text.toLowerCase();
        if (rule) signals.push(...rule.keys.filter(k => lower.includes(k.toLowerCase())).slice(0, 2).map(k => `命中「${k}」`));
        if (/[。；;]/.test(text) && text.length > 80) signals.push("句子很長，核心訊息被包裝");
        if (/將|持續|適當|審慎|重新|評估|monitor|continue|review/i.test(text)) signals.push("使用延後承諾語氣");
        if (/however|但|不過|although|雖然/i.test(text)) signals.push("前後轉折暗示真正立場");
        return signals.length ? signals.slice(0, 3) : ["語氣保留", "資訊不完整", "可能在避免直接表態"];
      }

      function scoreConfidence(text, rule) {
        let score = rule ? 76 : 48;
        if (rule) score += Math.min(18, rule.keys.filter(k => text.toLowerCase().includes(k.toLowerCase())).length * 6);
        if (text.length > 120) score += 6;
        if (/但|however|disagree|unfortunately|適當|持續/i.test(text)) score += 5;
        return Math.min(score, 97);
      }

      function decodeText(text) {
        const compact = text.replace(/\s+/g, " ").trim();
        if (!compact) return null;
        const lower = compact.toLowerCase();
        const rule = RULES.find(item => item.keys.some(k => lower.includes(k.toLowerCase())));
        if (rule) {
          return {
            human: rule.out[0],
            subtext: rule.out[1],
            belief: rule.out[2],
            meme: rule.out[3],
            nuclear: rule.out[4],
            label: rule.label,
            read: rule.read,
            confidence: scoreConfidence(compact, rule),
            signals: getSignals(compact, rule)
          };
        }
        if (compact.length > 240) {
          return {
            human: "這段話很長，但核心是在降低衝擊、保護立場、避免講死。",
            subtext: "事情可能沒那麼順，但作者不想直接承認。",
            belief: "請相信我們還在掌控局面。",
            meme: "講很多，重點是：先別罵我。",
            nuclear: "這段話如果真的有重點，就不需要這麼長。文字越厚，通常是底氣越薄。",
            label: "長篇聲明",
            read: "大型緩衝墊",
            confidence: scoreConfidence(compact),
            signals: getSignals(compact)
          };
        }
        return {
          human: "這句話可能不是字面意思，背後有保留。",
          subtext: "對方沒有把真正態度講滿。",
          belief: "請你接受這個比較好聽的版本。",
          meme: "人類又在加密通訊。",
          nuclear: "如果一句話需要你猜，代表對方把風險外包給你。猜錯是你誤會，猜對是你懂事。",
          label: "一般訊息",
          read: "低訊號保留",
          confidence: scoreConfidence(compact),
          signals: getSignals(compact)
        };
      }

      function shareText() {
        if (!currentOutput) return "";
        return `真話翻譯機\n\n原文：\n${input.value}\n\n類型：${currentOutput.label}｜${currentOutput.read}\n可信度：${currentOutput.confidence}%\n\n說人話：\n${currentOutput.human}\n\n話中有話：\n${currentOutput.subtext}\n\n最想讓你相信什麼：\n${currentOutput.belief}\n\n鄉民翻譯：\n${currentOutput.meme}\n\n核彈翻譯：\n${currentOutput.nuclear}`;
      }

      async function copyText(text, label) {
        await navigator.clipboard.writeText(text);
        showToast(label);
      }

      function renderOutput(output) {
        currentOutput = output;
        document.querySelector("#label").textContent = output.label;
        document.querySelector("#confidence").textContent = `${output.confidence}%`;
        document.querySelector("#bar").style.width = `${output.confidence}%`;
        document.querySelector("#read").textContent = output.read;
        document.querySelector("#signals").innerHTML = output.signals.map(signal => `<li>${signal}</li>`).join("");
        const cards = [
          ["說人話", "human", "human"],
          ["話中有話", "subtext", "subtext"],
          ["最想讓你相信什麼", "belief", "belief"],
          ["鄉民翻譯", "meme", "meme"],
          ["核彈翻譯", "nuclear", "nuclear"]
        ];
        results.hidden = false;
        results.innerHTML = cards.map(([title, key, tone]) => `
          <section class="result ${tone}">
            <div class="resultHead"><h3>${title}</h3><button class="copyOne" data-copy="${key}" aria-label="複製${title}">⧉</button></div>
            <p>${output[key]}</p>
          </section>
        `).join("") + `
          <p class="warning">核彈翻譯攻擊性較強，適合自用醒腦；真的要貼出去，請先深呼吸。</p>
          <div class="actions">
            <button id="copyAll">複製整段</button>
            <button id="share">分享給受害者</button>
          </div>
        `;
        results.querySelectorAll("[data-copy]").forEach(button => {
          button.addEventListener("click", () => copyText(output[button.dataset.copy], "已複製"));
        });
        results.querySelector("#copyAll").addEventListener("click", () => copyText(shareText(), "整段已複製"));
        results.querySelector("#share").addEventListener("click", async () => {
          const text = shareText();
          if (navigator.share) await navigator.share({ title: "真話翻譯機", text });
          else await copyText(text, "整段已複製");
        });
      }

      function runDecode() {
        const output = decodeText(input.value);
        if (!output) {
          showToast("先貼一段人類加密訊息");
          return;
        }
        renderOutput(output);
      }

      function loadDemo(demo) {
        input.value = demo.input;
        count.textContent = `${input.value.trim().length} 字`;
        renderOutput(demo.output);
      }

      document.querySelector("#demoGrid").innerHTML = DEMOS.map(demo => `<button class="demo" data-demo="${demo.id}">${demo.title}</button>`).join("");
      document.querySelectorAll("[data-demo]").forEach(button => {
        button.addEventListener("click", () => loadDemo(DEMOS.find(demo => demo.id === button.dataset.demo)));
      });
      document.querySelector("#decode").addEventListener("click", runDecode);
      document.querySelector("#reset").addEventListener("click", () => {
        input.value = "";
        currentOutput = null;
        count.textContent = "0 字";
        results.hidden = true;
        document.querySelector("#label").textContent = "等待解碼";
        document.querySelector("#confidence").textContent = "--";
        document.querySelector("#bar").style.width = "0";
        document.querySelector("#read").textContent = "貼上一段人類加密訊息，看看它真正想說什麼。";
        document.querySelector("#signals").innerHTML = "";
      });
      input.addEventListener("input", () => { count.textContent = `${input.value.trim().length} 字`; });
      loadDemo(DEMOS[0]);
