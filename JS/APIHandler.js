"use strict";

async function callAPI(request, enableErrorHandler = true, enableLoadingModal = true){
    
    if(enableLoadingModal){
        const loadingModal = document.createElement("div");
        loadingModal.classList.add("loadingModal");
        loadingModal.innerHTML = `
            <div>
                <span>Loading...</span>
            </div>
        `
    
        document.querySelector("body").appendChild(loadingModal);
    
    }

    const response = await fetch(request);

    if(!response.ok){
        if(enableLoadingModal){ 
            loadingModal.remove(); 
        }
        
        if(!enableErrorHandler){ 
            return response; 
        }

        errorHandler(response);
    }else{
        if(enableLoadingModal){ 
            loadingModal.remove(); 
        }
        
        return response;
    }

}

async function errorHandler(response){
    
    const resource = await response.json();

    const errorModal = document.createElement("div");
    errorModal.classList.add("errorModal");
    errorModal.innerHTML = `
        <div>
            <div>
                <p>Something went wrong:<br>${resource} (${response.status}: ${response.statusText})</p>
                <button class="confirmButton">Confirm</button>
            </div>
        </div>
    `
    errorModal.querySelector(".confirmButton").addEventListener("click", event => errorModal.remove());
    document.querySelector("main").append(errorModal);

}