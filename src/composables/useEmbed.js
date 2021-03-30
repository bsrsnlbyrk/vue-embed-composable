import { ref, computed } from '@vue/composition-api';

const useEmbed = (code = null) => {
    const embedCode = ref(code);

    const isEmbedBlock = computed(() => (
        /(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/.test(embedCode.value)
        || /(?:<blockquote[^>]*)(?:(?:\/>)|(?:>.*?<\/blockquote>))/.test(embedCode.value)
    ));

    const getEmbedScriptSrc = (embedString = embedCode.value) => {
        const parser = new DOMParser();
        const parsedCode = parser.parseFromString(embedString, 'text/html');
        console.log(parsedCode.body.childNodes);

        for (const node of parsedCode.body.childNodes) {
            if (node.tagName === 'SCRIPT') {
                return node.src;
            } else if (node.innerHTML && node.innerHTML.includes('<script')) {
                getEmbedScriptSrc(node.innerHTML);
            }
        }

        return null;
    }

    const clearScript = scriptEl => scriptEl.remove();

    const injectScript = ({ async = true, defer = false, id, src }) => {
        const scriptWithSameId = document.getElementById(id);
    
        if (scriptWithSameId) {
            clearScript(scriptWithSameId);
        }
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = id;
        script.src = src;
        script.async = async;
        script.defer = defer;
        document.body.insertAdjacentElement('afterend', script);
    };

    return {
        isEmbedBlock,
        injectScript,
        getEmbedScriptSrc,
        clearScript
    };
};

export {
    useEmbed
};