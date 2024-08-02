# Happi: A Mental and Physical Health App
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)

<p align="center">
	<img width=200 height=200 src="https://raw.githubusercontent.com/maithyy/Happi/main/Happi-Frontend/Hobbi/assets/happi_logo.png" alt="Happi Logo" />
</p>

<p align="center">
	<img width=200 src="https://raw.githubusercontent.com/maithyy/Happi/main/Happi-Frontend/Hobbi/assets/happi_text.png" alt="Happi Logo Text" />
</p>


<b>Happi is a mental and physical health app that 
uses real time health data and user inputted journal entries to recommend exercises and activities to help users meet their goals.</b>

The app provides users an overall score based on 3 metrics:
- Happiness score determined by Google Cloud Natural Language API's sentiment analysis of the users' journal entry
- Sleep score determined by hours slept from Apple HealthKit
- Fitness score determined by user set goals and data from Apple HealthKit

User authentication is done via Firebase and user preferences and goals are stored in Firestore.


## Set-up instructions
Frontend
1. cd Happi-Frontend, cd Hobbi
2. npx expo install --npm
3. npx expo start --web (if you're on Windows) or npx expo run:ios (if you're on Mac)

Backend
1. cd Happi-Backend
2. pip install -r requirements.txt
3. gcloud auth application-default login on google cloud cli
