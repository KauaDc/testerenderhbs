const publicVapidKey = 'BFTkZBOS_z4CJ3-7e-zrILz70H0bw9xoxanAtmq6KyMHpfeGmYAG46VaduG2W3R3biUfBzuZv8u__ZVasmwcja8'

//checar se o service worker está disponível
if('serviceWorker' in navigator){
    send().catch(err => console.error(err))
}

//registro do service worker, registro do push, enviar push
 async function send(){
    //registro do service worker
    console.log('registrando serviceworker...')
    const register = await navigator.serviceWorker.register('/worker.js',{
        scope:'/'
    })
    console.log('service worker registrado...')
    
    //registro do push
    console.log('registrando push...')
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })
    console.log('push registrado...')

    //enviar notificação push
    console.log('enviando push...')
    await fetch('/subscribe',{
        method:'POST',
        body: JSON.stringify(subscription),
        headers:{
            'content-type':'application/json'
        }
    })
    console.log('push enviado...')
 }

 function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  