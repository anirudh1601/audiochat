from channels.generic.websocket import AsyncWebsocketConsumer,WebsocketConsumer
from channels.consumer import AsyncConsumer
import json
from asgiref.sync import async_to_sync
import base64
import subprocess
ffmpeg_proc = subprocess.Popen('ffmpeg -y -f webm -i - -ac 1 -ar 16000  -f wav /tmp/out.wav', shell=True, stdin=subprocess.PIPE)


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'webrtcinternals'
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        
        self.accept()
        # print(self.channel_name)

        

        print('connected')
    def disconnect(self,close_code):
        self.disconnect()
    def receive(self,text_data=None, bytes_data=None):
        #print(event)
        my_string =bytes_data

        #print(my_string)
        #print(text_data)
        #print(len(my_string))
        #print(my_string)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat_message',
                'text':my_string
            }
        )


    def chat_message(self,event):
        #print('chat_message',event)
        message = event['text']
        #print(message)
        self.send(bytes_data=(
            message
        ))
        


# def to_bytes(s):
#     if type(s) is bytes:
#         return s
#     elif type(s) is str or (sys.version_info[0] < 3 and type(s) is unicode):
#         return codecs.encode(s, 'utf-8')
#     else:
#         raise TypeError("Expected bytes or string, but got %s." % type(s))       


        
        
        
