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
        const map = {
            '(': ')',
            ')': '(',
            '[': ']',
            ']': '[',
            '{': '}',
            '}': '{'
        };
        return map[char] || char;
    }

    function preprocessPairedSymbols(text) {
        let result = '';

        const openBrackets = ['(', '[', '{'];
        const closeBrackets = [')', ']', '}'];
        const allBrackets = [...openBrackets, ...closeBrackets];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (allBrackets.includes(char)) {
                let hasPersianAfter = false;
                let j = i + 1;

                while (j < text.length && /\s/.test(text[j])) {
                    j++;
                }

                if (
                    j < text.length &&
                    (
                        /[آ-یء-ي«»]/.test(text[j]) ||
                        /[۰-۹]/.test(text[j])
                    )
                ) {
                    hasPersianAfter = true;
                }

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

    function fixNode(node) {
        node.dir = 'rtl';

        node.childNodes.forEach(child => {

            if (child.nodeType === 3) {
                let text = child.nodeValue;

                if (!text || !text.trim()) return;

                text = preprocessPairedSymbols(text);

                const lines = text.split('\n');
                const fragment = document.createDocumentFragment();

                lines.forEach((line, lineIndex) => {

                    const chars = line.split('').map(char => ({
                        char,
                        type: getCharType(char)
                    }));

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
                                    (
                                        chars[i].type === 'symbol' &&
                                        (i === 0 || chars[i - 1].type !== 'space')
                                    )
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

                                if (ctype === 'persian' || ctype === 'persianDigit') {
                                    break;
                                }

                                if (ctype === 'latin' || ctype === 'latinDigit' || ctype === 'symbol') {
                                    buffer += chars[i].char;
                                    i++;
                                    continue;
                                }

                                if (ctype === 'space') {
                                    let k = i + 1;

                                    while (k < chars.length && chars[k].type === 'space') {
                                        k++;
                                    }

                                    if (
                                        k < chars.length &&
                                        (
                                            chars[k].type === 'latin' ||
                                            chars[k].type === 'latinDigit' ||
                                            chars[k].type === 'symbol'
                                        )
                                    ) {
                                        buffer += chars[i].char;
                                        i++;
                                        continue;
                                    }

                                    break;
                                }

                                break;
                            }

                            if (buffer) {
                                blocks.push({ text: buffer, dir: 'ltr' });
                            }
                        }

                        else if (ct === 'space') {

                            while (i < chars.length && chars[i].type === 'space') {
                                buffer += chars[i++].char;
                            }

                            blocks.push({ text: buffer, dir: null });
                        }

                        else {
                            buffer += chars[i++].char;
                            blocks.push({ text: buffer, dir: 'rtl' });
                        }
                    }

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

                child.parentNode.insertBefore(fragment, child);
                child.remove();
            }

            else if (child.nodeType === 1) {
                fixNode(child);
            }
        });
    }

    function scan(root) {
        const elements = root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, span, div, a, label');

        elements.forEach(el => {
            const hasDirectText = Array.from(el.childNodes).some(
                n => n.nodeType === 3 && n.nodeValue.trim()
            );

            if (hasDirectText) {
                fixNode(el);
            }
        });
    }

    function observe(root) {
        scan(root);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {

                    if (node.nodeType === 3 && node.nodeValue.trim()) {
                        if (node.parentNode) fixNode(node.parentNode);
                    }

                    if (node.nodeType === 1) {
                        fixNode(node);
                        scan(node);
                    }
                });
            });
        });

        observer.observe(root, {
            childList: true,
            subtree: true
        });

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
                if (node.parentNode) fixNode(node.parentNode);
            } else {
                fixNode(node);
            }
        }
    };

    global.BidiFixer = BidiFixer;

})(window);
