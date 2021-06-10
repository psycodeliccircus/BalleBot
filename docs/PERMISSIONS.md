# Permissões

Aqui está a lista de permissões de cada cargo:
A tabela informa a string usada para representar a permissão e os cargos que possuem essa permissão

|PERMISSION|CARGOS|
|:---:|:---:|
| "SPEAK" | Everyone, Padawan, <br> Mods, Staff |
| "STREAM" | Everyone, Padawan, <br> Mods, Staff |
| "CONNECT" | Everyone, Padawan, <br> Mods, Staff |
| "EMBED_LINKS" | Everyone, Padawan, <br> Mods, Staff |
| "VIEW_CHANNEL" | Everyone, Padawan, <br> Mods, Staff |
| "ATTACH_FILES" | Everyone, Padawan, <br> Mods, Staff |
| "ADD_REACTIONS" | Everyone, Padawan, <br> Mods, Staff |
| "SEND_MESSAGES" | Everyone, Padawan, <br> Mods, Staff |
| "CHANGE_NICKNAME" | Everyone, Padawan, <br> Mods, Staff |
| "SEND_TTS_MESSAGES" | Everyone, Padawan, <br> Mods, Staff |
| "USE_EXTERNAL_EMOJIS" | Everyone, Padawan, <br> Mods, Staff |
| "READ_MESSAGE_HISTORY" | Everyone, Padawan, <br> Mods, Staff |

|PERMISSION|CARGOS|
|:---:|:---:|
| "MANAGE_MESSAGES" | Padawan, Mods, Staff |

|PERMISSION|CARGOS|
|:---:|:---:|
| "BAN_MEMBERS" | Mods, Staff |
| "KICK_MEMBERS" | Mods, Staff |
| "MUTE_MEMBERS" | Mods, Staff |
| "MOVE_MEMBERS" | Mods, Staff |
| "DEAFEN_MEMBERS" | Mods, Staff |
| "MANAGE_NICKNAMES" | Mods, Staff |

|PERMISSION|CARGOS|
|:---:|:---:|
| "MANAGE_ROLES" | Staff |
| "MANAGE_EMOJIS" | Staff |
| "MANAGE_CHANNELS" | Staff |
| "MANAGE_WEBHOOKS" | Staff |
| "CREATE_INSTANT_INVITE" | Staff |


## Staff

```js
"VIEW_CHANNEL", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_EMOJIS",
"MANAGE_WEBHOOKS", "CREATE_INSTANT_INVITE", "CHANGE_NICKNAME",
"MANAGE_NICKNAMES", "KICK_MEMBERS", "BAN_MEMBERS", "SEND_MESSAGES",
"SEND_TTS_MESSAGES", "EMBED_LINKS",  "ATTACH_FILES", "ADD_REACTIONS",
"USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES", "READ_MESSAGE_HISTORY",
"CONNECT", "SPEAK", "STREAM", "MUTE_MEMBERS", "DEAFEN_MEMBERS",
"MOVE_MEMBERS"
```

## Mods

```js
"VIEW_CHANNEL", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "KICK_MEMBERS",
"BAN_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES",
"ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES",
"SEND_TTS_MESSAGES", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK",
"STREAM", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS"
```

## Padawan

```js
"VIEW_CHANNEL", "CHANGE_NICKNAME", "SEND_MESSAGES", "EMBED_LINKS",
"ATTACH_FILES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES",
"SEND_TTS_MESSAGES", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK", "STREAM"
```

## Everyone

```js
"VIEW_CHANNEL", "CHANGE_NICKNAME", "SEND_MESSAGES", "EMBED_LINKS",
"ATTACH_FILES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS",
"READ_MESSAGE_HISTORY", "SEND_TTS_MESSAGES", "CONNECT", "SPEAK", "STREAM"
```
