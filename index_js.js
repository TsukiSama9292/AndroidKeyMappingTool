// 使用 fetch 方法來獲取指定路徑的 Markdown 檔案（INST.md）
fetch('./INST.md')
.then(response => response.text()) // 從回應物件中獲取文字內容
.then(text => {
    // 將 Markdown 文本轉換為 HTML 格式
    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);
    // 將轉換後的 HTML 內容顯示在 id 為 'markdown-content' 的元素中
    document.getElementById('markdown-content').innerHTML = html;
    // 提取 Markdown 中的標題，並創建導航欄連結
    const headings = document.querySelectorAll('#markdown-content h2, #markdown-content h3, #markdown-content h4, #markdown-content h5, #markdown-content h6');
    const navElement = document.getElementById('markdown-nav');
    headings.forEach(heading => {
        // 獲取標題的層級（由標籤名稱的第二個字元表示）
        const level = parseInt(heading.tagName.charAt(1));
        // 獲取標題的文字內容並去除空白字符
        const text = heading.textContent.trim();
        // 將標題轉換成小寫並以連字符分隔單詞，用作導航連結的目標 id
        const targetId = text.replace(/\s+/g, '-').toLowerCase();
        // 創建一個包裹標題的 div 元素，並設置其 id
        const divWrapper = document.createElement('div');
        divWrapper.id = targetId;
        // 將該 div 插入到標題前面，以便獲取更靈活的佈局
        heading.parentNode.insertBefore(divWrapper, heading);
        // 將標題移動到剛剛創建的 div 內部
        divWrapper.appendChild(heading);
        // 創建一個帶有標題文字的錨點元素（a 標籤），設置其類名和 href 屬性
        const link = document.createElement('a');
        link.textContent = text;
        link.classList.add('nav-link', `level-${level}`);
        link.href = `#${targetId}`;
        // 添加點擊事件監聽器，當點擊時阻止默認行為並平滑滾動到目標位置
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight; // 獲取頭部高度
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight; // 計算目標位置，考慮頭部高度
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
        // 在導航欄元素中添加連結
        navElement.appendChild(link);
        // 添加換行元素，以增加導航欄的可讀性
        navElement.appendChild(document.createElement('br'));
        navElement.appendChild(document.createElement('br'));
    });
})
// 如果在獲取 Markdown 檔案時出現錯誤，則在控制台中輸出錯誤訊息
.catch(error => console.error('載入 Markdown 檔案時發生錯誤：', error));
