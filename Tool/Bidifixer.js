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
        const open = ['(', '[', '{'];
        const all = [...open, ')', ']', '}'];

        let result = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (all.includes(char)) {
                let j = i + 1;

                while (j < text.length && /\s/.test(text[j])) {
                    j++;
                }

                let hasPersianAfter =
                    j < text.length &&
                    /[آ-یء-ي«»۰-۹]/.test(text[j]);

                if (open.includes(char) && hasPersianAfter) {
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

    function fixTextNode(node) {
        let text = node.nodeValue;
        if (!text || !text.trim()) return;

        text = preprocessPairedSymbols(text);

        const span = document.createElement('span');
        span.textContent = text;

        node.parentNode.replaceChild(span, node);
    }

    function scan(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null
        );

        let node;
        const list = [];

        while (node = walker.nextNode()) {
            list.push(node);
        }

        list.forEach(fixTextNode);
    }

    function observe(root) {
        const observer = new MutationObserver((mutations) => {

            mutations.forEach(m => {

                m.addedNodes.forEach(node => {

                    if (node.nodeType === 3) {
                        fixTextNode(node);
                    }

                    if (node.nodeType === 1) {
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
            scan(root);
            return observe(root);
        },

        fix(node) {
            if (node.nodeType === 3) {
                fixTextNode(node);
            } else {
                scan(node);
            }
        }
    };

    global.BidiFixer = BidiFixer;

})(window);
