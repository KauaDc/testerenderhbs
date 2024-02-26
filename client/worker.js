/*console.log('service worker carregado...')

self.addEventListener('push',e=>{
    const data = e.data.json()
    console.log('push recebido...')
    self.registration.showNotification(data.title,{
        body: data.body,
        icon: data.icon,        
    })
})*/
console.log('service worker carregado...')

self.addEventListener('push', e => {
    const data = e.data.json()
    console.log('push recebido...')
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        data: {
            url: 'https://sonhoencanta.discloud.app/' // Adicione a URL aqui
        }
    })
})

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        clients.openWindow(e.notification.data.url)
    );
});