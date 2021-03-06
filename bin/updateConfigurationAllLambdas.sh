
#!/usr/bin/env bash

echo 'Update all Lambda Function Configurations'

gulp updateFunctionConfiguration --lambdaFunctionName apiAuthorizer
gulp updateFunctionConfiguration --lambdaFunctionName apiUpdateAuthorizer
gulp updateFunctionConfiguration --lambdaFunctionName createSamesurfRoomCookies
gulp updateFunctionConfiguration --lambdaFunctionName endSamesurfSession
gulp updateFunctionConfiguration --lambdaFunctionName findSamesurfRoom
gulp updateFunctionConfiguration --lambdaFunctionName getAccountCreateConfig
gulp updateFunctionConfiguration --lambdaFunctionName getAccountSettingsConfig
gulp updateFunctionConfiguration --lambdaFunctionName getAllFirmsConfig
gulp updateFunctionConfiguration --lambdaFunctionName getAllowedOrigins
gulp updateFunctionConfiguration --lambdaFunctionName getApiKeys
gulp updateFunctionConfiguration --lambdaFunctionName getAppSettings
gulp updateFunctionConfiguration --lambdaFunctionName getAppSettingsByFirmOID
gulp updateFunctionConfiguration --lambdaFunctionName getBillingPlan
gulp updateFunctionConfiguration --lambdaFunctionName getCharts
gulp updateFunctionConfiguration --lambdaFunctionName getContent
gulp updateFunctionConfiguration --lambdaFunctionName getDateTimestamp
gulp updateFunctionConfiguration --lambdaFunctionName getEnabled
gulp updateFunctionConfiguration --lambdaFunctionName getExclusionsInclusions
gulp updateFunctionConfiguration --lambdaFunctionName getGiftingConfig
gulp updateFunctionConfiguration --lambdaFunctionName getGoalTypes
gulp updateFunctionConfiguration --lambdaFunctionName getHeaderConfig
gulp updateFunctionConfiguration --lambdaFunctionName getHostNameByFirmOID
gulp updateFunctionConfiguration --lambdaFunctionName getKeycloakSettings
gulp updateFunctionConfiguration --lambdaFunctionName getPerformanceData
gulp updateFunctionConfiguration --lambdaFunctionName getProgramConfig
gulp updateFunctionConfiguration --lambdaFunctionName getProgramList
gulp updateFunctionConfiguration --lambdaFunctionName getQuestionnaireConfig
gulp updateFunctionConfiguration --lambdaFunctionName getQuestionnaireContentConfig
gulp updateFunctionConfiguration --lambdaFunctionName getRiskLevels
gulp updateFunctionConfiguration --lambdaFunctionName getSamesurfKey
gulp updateFunctionConfiguration --lambdaFunctionName getSecurity
gulp updateFunctionConfiguration --lambdaFunctionName getTransferMoney
gulp updateFunctionConfiguration --lambdaFunctionName getGoogleAnalytics
gulp updateFunctionConfiguration --lambdaFunctionName getDwpFirmDataByFirmOID
gulp updateFunctionConfiguration --lambdaFunctionName getContentManagement
gulp updateFunctionConfiguration --lambdaFunctionName createNewUaoOnboardingRecords
gulp updateFunctionConfiguration --lambdaFunctionName updateUaoAccountsCategory
gulp updateFunctionConfiguration --lambdaFunctionName updateUaoAccountsType
gulp updateFunctionConfiguration --lambdaFunctionName updateEnable
gulp updateFunctionConfiguration --lambdaFunctionName updateGoogleAnalyticsTable
gulp updateFunctionConfiguration --lambdaFunctionName updateTheme
gulp updateFunctionConfiguration --lambdaFunctionName updateCharts
gulp updateFunctionConfiguration --lambdaFunctionName updateBillingPlan
gulp updateFunctionConfiguration --lambdaFunctionName updateErrorMessageMap
gulp updateFunctionConfiguration --lambdaFunctionName updateContent
gulp updateFunctionConfiguration --lambdaFunctionName updateHeaderConfig
gulp updateFunctionConfiguration --lambdaFunctionName updateProgramList
gulp updateFunctionConfiguration --lambdaFunctionName updateQuestionnaireConfig
gulp updateFunctionConfiguration --lambdaFunctionName updateQuestionnaireContent
gulp updateFunctionConfiguration --lambdaFunctionName updateAppSettings
gulp updateFunctionConfiguration --lambdaFunctionName updateRisklevels
gulp updateFunctionConfiguration --lambdaFunctionName updateDummy
