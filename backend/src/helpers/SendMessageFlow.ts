import Whatsapp from "../models/Whatsapp";
import GetWhatsappWbot from "./GetWhatsappWbot";
import fs from "fs";

import { getMessageOptions } from "../services/WbotServices/SendWhatsAppMedia";

export type MessageData = {
  number: number | string;
  body: string;
  mediaPath?: string;
};

export const SendMessageFlow = async (  
  whatsapp: Whatsapp,
  messageData: MessageData,
  isFlow: boolean = false,
  isRecord: boolean = false
): Promise<any> => {
  try {
    const wbot = await GetWhatsappWbot(whatsapp);
    const chatId = `${messageData.number}@s.whatsapp.net`;

    let message;

    // Definición de los botones de plantilla
    const templateButtons = [
      {
        index: 1, 
        urlButton: {
          displayText: '⭐ Estrella Baileys en GitHub!', 
          url: 'https://github.com/adiwajshing/Baileys'
        }
      },
      {
        index: 2, 
        callButton: {
          displayText: '¡Llámanos!', 
          phoneNumber: '+51999053124'
        }
      },
      {
        index: 3, 
        quickReplyButton: {
          displayText: '¡Esta es una respuesta rápida, como los botones normales!', 
          id: 'id-like-buttons-message'
        }
      }
    ];
    
    // El cuerpo del mensaje
    const body = `\u200e${messageData.body}`;

    // Estructura del mensaje de plantilla
    const templateMessage = {
      text: body,
      footer: 'Este es un pie de página', // El pie de página es opcional
      templateButtons: templateButtons
    };

    // Enviar el mensaje utilizando Baileys
    message = await wbot.sendMessage(chatId, templateMessage);

    return message;
  } catch (err: any) {
    throw new Error(err);
  }
};
