const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const CHANNEL_ID = process.env.CODE_CHANNEL_ID; // ID do canal onde os códigos serão enviados
const CODE_DURATION = 30000; // 30 segundos

// Gerar código aleatório
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
        if (i === 3) code += '-';
    }
    return code;
}

// Criar código no backend
async function createCode(code) {
    try {
        await axios.post(`${API_URL}/code/create`, {
            code,
            expiresIn: CODE_DURATION
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.BOT_API_KEY}`
            }
        });
        return true;
    } catch (error) {
        console.error('Erro ao criar código:', error.message);
        return false;
    }
}

// Enviar código no canal
async function sendCodeToChannel(channel) {
    const code = generateCode();
    
    // Criar código no backend
    const created = await createCode(code);
    if (!created) {
        console.error('Falha ao criar código no backend');
        return;
    }

    // Criar embed
    const embed = new EmbedBuilder()
        .setColor('#2563eb')
        .setTitle('🔑 NOVO CÓDIGO DISPONÍVEL')
        .setDescription(`\`\`\`${code}\`\`\``)
        .addFields(
            { name: '⏱️ Validade', value: '30 segundos', inline: true },
            { name: '🌐 Usar em', value: '[LAG TECK](https://seu-site.com)', inline: true }
        )
        .setFooter({ text: 'LAG TECK • Código gerado automaticamente' })
        .setTimestamp();

    const message = await channel.send({ embeds: [embed] });

    // Deletar mensagem após 30 segundos
    setTimeout(() => {
        message.delete().catch(console.error);
    }, CODE_DURATION);

    console.log(`✅ Código enviado: ${code}`);
}

// Sistema de geração automática
function startCodeGeneration(channel) {
    console.log('🚀 Sistema de códigos iniciado!');
    
    // Enviar primeiro código imediatamente
    sendCodeToChannel(channel);
    
    // Continuar enviando a cada 30 segundos
    setInterval(() => {
        sendCodeToChannel(channel);
    }, CODE_DURATION);
}

client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error('❌ Canal não encontrado! Verifique o CHANNEL_ID no .env');
        return;
    }

    console.log(`📡 Canal encontrado: #${channel.name}`);
    startCodeGeneration(channel);
});

// Comando manual para gerar código
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // Comando: !gerarcodigo (apenas para administradores)
    if (message.content === '!gerarcodigo' && message.member.permissions.has('Administrator')) {
        const channel = message.channel;
        await sendCodeToChannel(channel);
        message.react('✅').catch(console.error);
    }
});

// Tratamento de erros
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Login
client.login(process.env.DISCORD_BOT_TOKEN);
