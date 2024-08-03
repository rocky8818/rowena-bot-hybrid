const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { delay } = require('@whiskeysockets/baileys')
const path = require('path')
const fs = require('fs')

const menuPath = path.join(__dirname, 'mensajes', 'menu.txt');
const menu = fs.readFileSync(menuPath, 'utf-8')

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('Bienvenido', {
        delay: 4000,
        media:''
    },
    async (ctx, ctxFn) => {
        console.log(ctx.body)
        await ctxFn.flowDynamic("")
    })

    const flowSetup = addKeyword(EVENTS.ACTION).addAnswer(
        'Este es Uno de nuestros setups favoritos.',{
            media: 'https://i.pinimg.com/564x/2d/d3/9c/2dd39c94e404e9f8d6e5760f57f9c3e2.jpg'
        }
    )

const flowMenu = addKeyword('menu').addAnswer(
    menu,
    {capture:true},
    async (ctx, {gotoFlow, fallBack, flowDynamic}) => {
        if(!['1','2','3','0'].includes(ctx.body)){
            console.log(ctx.body)
            return fallBack('Respuesta no valida, por favor elige una de las ociones. 1, 2, 3, 0')
        }
        switch(ctx.body){
            case '1':
                return gotoFlow(flowSetup);
            case '2':
                return gotoFlow(flowSetup);
            case '0':
                return await flowDynamic('Saliendo del flow')
        }
    }
)

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome, flowMenu, flowSetup])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
