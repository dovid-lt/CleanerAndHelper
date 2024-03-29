function ObserveForDocument(actionForElement, document) {
    let isConnected = false;
    const mo = new MutationObserver(onMutation);
    onMutation([{ addedNodes: [document.documentElement] }]);
    observe();


    function* getActions(mutations) {
        for (const m of mutations)
            for (const n of m.addedNodes)
                yield* actionForElement(n);
    }

    function onMutation(mutations) {
        const actions = getActions(mutations);

        let result = actions.next();
        if (!result.done) {
            if (isConnected)
                mo.disconnect();

            do{
                result.value?.();
                result = actions.next();
            } while(!result.done)

            if (isConnected)
                observe();
        }
    }

    function observe() {
        mo.observe(document, { subtree: true, childList: true, });
        isConnected = true;
    }
}
