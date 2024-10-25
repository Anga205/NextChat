use futures::{SinkExt, StreamExt};
use rand::Rng;
use std::collections::HashSet;
use std::sync::{Arc, Mutex};
use warp::ws::{Message, WebSocket};
use warp::Filter;

type Client = Arc<Mutex<HashSet<String>>>;

#[tokio::main]
async fn main() {
    let clients: Client = Arc::new(Mutex::new(HashSet::new()));

    let route = warp::path("socketman")
        .and(warp::ws())
        .and(with_clients(clients.clone()))
        .map(|webs: warp::ws::Ws, clients| {
            webs.on_upgrade(|websocket| handler(websocket, clients))
        });

    warp::serve(route).run(([127, 0, 0, 1], 9001)).await;
}

fn with_clients(
    clients: Client,
) -> impl Filter<Extract = (Client,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || clients.clone())
}

async fn handler(ws: WebSocket, clients: Client) {
    let (mut sender, mut receiver) = ws.split();

    let client_id = rand::thread_rng().gen::<u32>().to_string();

    clients.lock().unwrap().insert(client_id.clone());

    while let Some(result) = receiver.next().await {
        match result {
            Ok(msg) => {
                if let Ok(text) = msg.to_str() {
                    println!("Sender {} -- Message : {}", client_id, text);
                    let message = format!("Sender {} -- Message : {}", client_id, text);
                    let broad_cast_msg = Message::text(message);
                    if let Err(err) = sender.send(broad_cast_msg).await {
                        println!("Error while sending the message : {}", err);
                        break;
                    }
                }
            }
            Err(err) => {
                println!("Error while sending the message : {:?}", err);
                break;
            }
        }
    }
    clients.lock().unwrap().remove(&client_id);
    println!("Client disconnect now");
}
