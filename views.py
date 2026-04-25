
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import requests
import os

class TeleportProcessView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # 1. Extract Data
        user_image = request.FILES.get('image')
        lat = request.data.get('lat', '0')
        lng = request.data.get('lng', '0')

        # 2. API Config (Generate these later and set as Env Variables)
        REMOVE_BG_KEY = os.getenv('REMOVE_BG_KEY', 'YOUR_REMOVE_BG_KEY')
        GOOGLE_MAPS_KEY = os.getenv('GOOGLE_MAPS_KEY', 'YOUR_GOOGLE_KEY')

        # 3. Fetch Background (Google Street View)
        bg_url = f"https://maps.googleapis.com/maps/api/streetview?size=1024x1024&location={lat},{lng}&key={GOOGLE_MAPS_KEY}"

        # 4. Remove Background (Remove.bg)
        rbg_response = requests.post(
            'https://api.remove.bg/v1.0/removebg',
            files={'image_file': user_image},
            data={'size': 'auto'},
            headers={'X-Api-Key': REMOVE_BG_KEY},
        )

        if rbg_response.status_code == 200:
            # We return the background URL and the transparent foreground (as hex or base64)
            return Response({
                "background_url": bg_url,
                "foreground_data": rbg_response.content.hex(), 
                "status": "success"
            })
        
        return Response({"error": "Failed to process image"}, status=400)
