(function (global) {

    function getCharType(char) {
        const code = char.charCodeAt(0);

        if (code === 0x200F || code === 0x200E) return 'space';
        if (/[آ-یء-ي«»]/.test(char)) return 'persian';
        if (/[۰-۹]/.test(char)) return 'persianDigit';
        if (/[A-Za-z]/.test(char)) return 'latin';
        if (/[0-9]/.test(char)) return 'latinDigit';
        if (/\s/.test(char)) return 'space';
        if (char === '\n') return 'newline';

        return 'symbol';
    }

    function reverseBracket(char) {
        const map = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{' };
        return map[char] || char;
    }

    function preprocessPairedSymbols(text) {
        const openBrackets = ['(', '[', '{'];
        const allBrackets = ['(', ')', '[', ']', '{', '}'];
        let result = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (allBrackets.includes(char)) {
                let j = i + 1;
                while (j < text.length && /\s/.test(text[j])) j++;

                const hasPersianAfter =
                    j < text.length &&
                    (/[آ-یء-ي«»]/.test(text[j]) || /[۰-۹]/.test(text[j]));

                if (openBrackets.includes(char) && hasPersianAfter) {
                    result += reverseBracket(char);
                } else {
                    result += char;
                }
            } else {
                result += char;
            }
        }

        return result;
    }

    function buildBlocks(line) {
        const chars = line.split('').map(char => ({ char, type: getCharType(char) }));
        const blocks = [];
        let i = 0;

        while (i < chars.length) {
            const ct = chars[i].type;
            let buffer = '';

            if (ct === 'persian' || ct === 'persianDigit') {
                while (
                    i < chars.length &&
                    (
                        chars[i].type === 'persian' ||
                        chars[i].type === 'persianDigit' ||
                        (chars[i].type === 'symbol' && i > 0 && chars[i - 1].type !== 'space')
                    )
                ) {
                    buffer += chars[i++].char;
                }
                blocks.push({ text: buffer, dir: 'rtl' });
            }

            else if (ct === 'latin' || ct === 'latinDigit' || ct === 'symbol') {
                let startIdx = i;
                while (
                    startIdx > 0 &&
                    chars[startIdx - 1].type === 'symbol' &&
                    (startIdx - 1 === 0 || chars[startIdx - 2].type !== 'space')
                ) {
                    startIdx--;
                }
                i = startIdx;

                while (i < chars.length) {
                    const ctype = chars[i].type;

                    if (ctype === 'persian' || ctype === 'persianDigit') break;

                    if (ctype === 'latin' || ctype === 'latinDigit' || ctype === 'symbol') {
                        buffer += chars[i++].char;
                        continue;
                    }

                    if (ctype === 'space') {
                        let k = i + 1;
                        while (k < chars.length && chars[k].type === 'space') k++;

                        if (
                            k < chars.length &&
                            (chars[k].type === 'latin' || chars[k].type === 'latinDigit' || chars[k].type === 'symbol')
                        ) {
                            buffer += chars[i++].char;
                            continue;
                        }
                        break;
                    }

                    break;
                }

                if (buffer) blocks.push({ text: buffer, dir: 'ltr' });
            }

            else if (ct === 'space') {
                while (i < chars.length && chars[i].type === 'space') {
                    buffer += chars[i++].char;
                }
                blocks.push({ text: buffer, dir: null });
            }

            else {
                blocks.push({ text: chars[i++].char, dir: 'rtl' });
            }
        }

        return blocks;
    }

    function processTextNode(textNode) {
        const rawText = textNode.nodeValue;
        if (!rawText || !rawText.trim()) return;

        const text = preprocessPairedSymbols(rawText);
        const lines = text.split('\n');
        const fragment = document.createDocumentFragment();

        lines.forEach((line, lineIndex) => {
            const blocks = buildBlocks(line);

            blocks.forEach(block => {
                if (block.dir === 'ltr') {
                    const span = document.createElement('span');
                    span.style.unicodeBidi = 'isolate';
                    span.style.direction = 'ltr';
                    span.style.display = 'inline-block';
                    span.textContent = block.text;
                    fragment.appendChild(span);
                } else {
                    fragment.appendChild(document.createTextNode(block.text));
                }
            });

            if (lineIndex < lines.length - 1) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        textNode.parentNode.insertBefore(fragment, textNode);
        textNode.parentNode.removeChild(textNode);
    }

    // collect all text nodes inside a root, then process them
    function collectTextNodes(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const tag = node.parentNode && node.parentNode.tagName;
                    if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
                    if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];
        let node;
        while ((node = walker.nextNode())) nodes.push(node);
        return nodes;
    }

    function scan(root) {
        // set direction on root
        if (root !== document.body) root.dir = 'rtl';

        const textNodes = collectTextNodes(root);
        textNodes.forEach(node => {
            if (node.parentNode) {
                node.parentNode.dir = 'rtl';
                processTextNode(node);
            }
        });
    }

    function observe(root) {
        scan(root);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 3) {
                        if (node.parentNode && node.nodeValue && node.nodeValue.trim()) {
                            node.parentNode.dir = 'rtl';
                            processTextNode(node);
                        }
                    } else if (node.nodeType === 1) {
                        scan(node);
                    }
                });
            });
        });

        observer.observe(root, { childList: true, subtree: true });
        return observer;
    }

    const BidiFixer = {

        scan(root = document.body) {
            scan(root);
        },

        observe(root = document.body) {
            return observe(root);
        },

        fix(node) {
            if (node.nodeType === 3) {
                if (node.parentNode) {
                    node.parentNode.dir = 'rtl';
                    processTextNode(node);
                }
            } else {
                scan(node);
            }
        }
    };

    global.BidiFixer = BidiFixer;

})(window);
