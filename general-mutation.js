function ObserveForDocument(elementsSelector, document){
    let isConnected = false;
    const mo = new MutationObserver(onMutation);
    onMutation([{ addedNodes: [document.documentElement] }]);
    observe();
    
   
    function onMutation(mutations) {
        const actions = [...elementsSelector(mutations)];
    
        if (actions.length) {
            if (isConnected)
                mo.disconnect();
    
            for (const el of actions) 
                if(el)
                    el();
            
            if (isConnected)
                observe();
        }
    }
    
    function observe() {
        mo.observe(document, { subtree: true, childList: true, });
        isConnected = true;
    }
}
