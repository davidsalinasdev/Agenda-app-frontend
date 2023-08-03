export interface Evento {
    id?: number;
    evento: string;
    lugar_evento: string;
    fecha_hora_evento: string;
    etiqueta: string;
    estado: string;
    alcance: string;
    users_id?: number;
    created_at?: string;
    updated_at?: string;
}