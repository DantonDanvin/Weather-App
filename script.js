const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let oldTab = userTab;
const API_KEY = "2a6ef359488f319117047a4c25b8f275";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
    
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
           
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
           
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    
    grantAccessContainer.classList.remove("active");
 
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
      

    }

}

function renderWeatherInfo(weatherInfo) {
     

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

   
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
       
    }
}

    def get_risk_assessment(self, prediction, confidence):
        """Get risk level and color coding"""
        if prediction == 'no_disaster':
            if confidence > 0.9:
                return 'SAFE', '#4CAF50', 'Weather conditions are safe. No disaster risk detected.'
            else:
                return 'LOW', '#8BC34A', 'Low risk conditions. Stay informed about weather changes.'
        
        # For disaster predictions
        if confidence > 0.8:
            return 'HIGH', '#F44336', f'High risk of {prediction}. Take immediate precautions!'
        elif confidence > 0.6:
            return 'MEDIUM', '#FF9800', f'Moderate risk of {prediction}. Stay prepared and alert.'
        elif confidence > 0.4:
            return 'LOW', '#FFC107', f'Low risk of {prediction}. Monitor weather conditions.'
        else:
            return 'MINIMAL', '#8BC34A', f'Minimal risk detected. Continue normal activities with awareness.'
    
    def get_recommendations(self, disaster_type, risk_level):
        """Get safety recommendations"""
        recommendations_db = {
            'flood': [
                "Move to higher ground immediately if risk is high",
                "Avoid walking or driving through flood water", 
                "Stay away from electrical lines and equipment",
                "Keep emergency supplies ready (water, food, flashlight)",
                "Monitor local emergency broadcasts and alerts"
            ],
            'drought': [
                "Conserve water usage immediately",
                "Store emergency water supplies",
                "Protect crops and livestock if applicable", 
                "Monitor fire restrictions in your area",
                "Stay hydrated and limit outdoor activities during heat"
            ],
            'cyclone': [
                "Secure loose objects around your property",
                "Stock up on emergency supplies (food, water, medicine)",
                "Know your evacuation route and shelter locations",
                "Stay indoors and away from windows during the storm",
                "Monitor weather updates and official warnings regularly"
            ],
            'heatwave': [
                "Stay indoors during peak hours (10 AM - 4 PM)",
                "Drink plenty of water regularly, even if not thirsty",
                "Wear light-colored, loose-fitting clothing",
                "Check on elderly neighbors and relatives",
                "Avoid strenuous outdoor activities and direct sunlight"
            ],
            'landslide': [
                "Stay away from steep slopes during heavy rain",
                "Be alert for unusual sounds (cracking, rumbling)",
                "Have an evacuation plan ready",
                "Monitor hillside areas for signs of movement",
                "Contact authorities if you notice ground cracks or tilting"
            ],
            'no_disaster': [
                "Continue normal activities with weather awareness",
                "Keep emergency kit updated and accessible", 
                "Stay informed about weather forecasts",
                "Review family emergency plans periodically",
                "Maintain emergency contact information"
            ]
        }
        
        base_recommendations = recommendations_db.get(disaster_type, recommendations_db['no_disaster'])
        
        if risk_level == 'HIGH':
            base_recommendations.insert(0, "⚠️ URGENT: Take immediate protective action!")
        
        return base_recommendations[:5]  # Return top 5 recommendations

# Initialize the predictor
try:
    climate_predictor = TrainedClimatePredictor()
    logger.info("🚀 Climate Predictor initialized successfully!")
except Exception as e:
    logger.error(f"❌ Failed to initialize predictor: {str(e)}")
    climate_predictor = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    if climate_predictor is None:
        return jsonify({
            'status': 'unhealthy',
            'error': 'Models not loaded',
            'timestamp': datetime.now().isoformat()
        }), 500
    
    return jsonify({
        'status': 'healthy',
        'models_loaded': True,
        'available_classes': climate_predictor.label_encoder.classes_.tolist(),
        'model_accuracies': {
            'random_forest': 99.43,
            'gradient_boosting': 99.77, 
            'lstm': 98.63
        },
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict_disaster():
    """Main prediction endpoint using your trained models"""
    if climate_predictor is None:
        return jsonify({
            'success': False,
            'error': 'Models not loaded properly'
        }), 500
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Prepare input data
        input_data = climate_predictor.prepare_input_data(data)
        
        # Make prediction using trained models
        result = climate_predictor.predict_with_ensemble(input_data)
        
        # Get risk assessment
        risk_level, alert_color, alert_message = climate_predictor.get_risk_assessment(
            result['prediction'], result['confidence']
        )
        
        # Get recommendations
        recommendations = climate_predictor.get_recommendations(
            result['prediction'], risk_level
        )
        
        # Prepare response
        response = {
            'success': True,
            'prediction': result['prediction'],
            'confidence': result['confidence'],
            'risk_level': risk_level,
            'alert_color': alert_color,
            'alert_message': alert_message,
            'recommendations': recommendations,
            'probabilities': result['probabilities'],
            'model_info': result['model_accuracy'],
            'input_data': data,
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f"✅ Prediction made: {result['prediction']} ({result['confidence']:.3f})")
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"❌ Prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/model_info', methods=['GET'])
def get_model_info():
    """Get information about the trained models"""
    if climate_predictor is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    return jsonify({
        'success': True,
        'model_info': {
            'classes': climate_predictor.label_encoder.classes_.tolist(),
            'feature_names': climate_predictor.feature_names,
            'model_accuracies': {
                'random_forest': 99.43,
                'gradient_boosting': 99.77,
                'lstm': 98.63
            },
            'training_data_size': 15000,
            'disaster_distribution': {
                'no_disaster': 13863,
                'heatwave': 692,
                'drought': 371,
                'flood': 31,
                'landslide': 24,
                'cyclone': 19
            }
        }
    })

@app.route('/test_prediction', methods=['GET'])
def test_prediction():
    """Test endpoint with sample data"""
    if climate_predictor is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    # Test with sample flood conditions
    test_data = {
        'temperature': 25,
        'humidity': 85,
        'pressure': 1005,
        'wind_speed': 15,
        'precipitation': 25,
        'elevation': 200,
        'season': 2,
        'latitude': 28.6,
        'longitude': 77.2
    }
    
    try:
        input_data = climate_predictor.prepare_input_data(test_data)
        result = climate_predictor.predict_with_ensemble(input_data)
        
        return jsonify({
            'success': True,
            'test_input': test_data,
            'prediction_result': result,
            'message': 'Test prediction successful!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🌍 Climate Disaster Prediction API Server")
    print("=" * 50)
    
    if climate_predictor is None:
        print("❌ ERROR: Models not loaded!")
        print("📁 Make sure these files are in the same directory:")
        print("   - climate_disaster_model_rf.pkl")
        print("   - climate_disaster_model_gb.pkl")
        print("   - climate_disaster_model_lstm.h5")
        print("   - climate_disaster_model_scaler.pkl")
        print("   - climate_disaster_model_encoder.pkl")
        print("\n💡 Run the model training script first!")
    else:
        print("✅ All models loaded successfully!")
        print(f"📊 Available classes: {climate_predictor.label_encoder.classes_}")
        print(f"🎯 Model accuracies: RF=99.43%, GB=99.77%, LSTM=98.63%")
    
    print("\n📋 Available endpoints:")
    print("   GET  /health - Health check")
    print("   POST /predict - Make disaster prediction")
    print("   GET  /model_info - Get model information")
    print("   GET  /test_prediction - Test with sample data")
    print("\n🚀 Server starting on http://localhost:5000")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)

