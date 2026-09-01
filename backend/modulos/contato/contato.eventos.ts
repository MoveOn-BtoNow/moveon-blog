import { EventEmitter } from "node:events";

export type EventoContato = {
  tipo: "nova_mensagem";
  id: string;
  nome: string;
  assunto: string;
};

class EventosContato extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(500);
  }
  publicar(evento: EventoContato) {
    this.emit("contato", evento);
  }
  ouvir(ouvinte: (evento: EventoContato) => void) {
    this.on("contato", ouvinte);
    return () => this.off("contato", ouvinte);
  }
}

export const eventosContato = new EventosContato();
