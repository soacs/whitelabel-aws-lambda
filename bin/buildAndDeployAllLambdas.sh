
#!/usr/bin/env bash

echo 'Build and Deploy all Lambda Functions for stash to SBX'

gulp lambdaFunctionAll --lambdaFunctionName apiAuthorizer
gulp lambdaFunctionAll --lambdaFunctionName createSamesurfRoomCookies
gulp lambdaFunctionAll --lambdaFunctionName endSamesurfSession
gulp lambdaFunctionAll --lambdaFunctionName findSamesurfRoom
gulp lambdaFunctionAll --lambdaFunctionName getAccountCreateConfig
gulp lambdaFunctionAll --lambdaFunctionName getAccountSettingsConfig
gulp lambdaFunctionAll --lambdaFunctionName getAllFirmsConfig
gulp lambdaFunctionAll --lambdaFunctionName getAllowedOrigins
gulp lambdaFunctionAll --lambdaFunctionName getApiKeys
gulp lambdaFunctionAll --lambdaFunctionName getAppSettings
gulp lambdaFunctionAll --lambdaFunctionName getAppSettingsByFirmOID
gulp lambdaFunctionAll --lambdaFunctionName getBillingPlan
gulp lambdaFunctionAll --lambdaFunctionName getCharts
gulp lambdaFunctionAll --lambdaFunctionName getContent
gulp lambdaFunctionAll --lambdaFunctionName getDateTimestamp
gulp lambdaFunctionAll --lambdaFunctionName getEnabled
gulp lambdaFunctionAll --lambdaFunctionName getExclusionsInclusions
gulp lambdaFunctionAll --lambdaFunctionName getGiftingConfig
gulp lambdaFunctionAll --lambdaFunctionName getGoalTypes
gulp lambdaFunctionAll --lambdaFunctionName getHeaderConfig
gulp lambdaFunctionAll --lambdaFunctionName getHostNameByFirmOID
gulp lambdaFunctionAll --lambdaFunctionName getKeycloakSettings
gulp lambdaFunctionAll --lambdaFunctionName getPerformanceData
gulp lambdaFunctionAll --lambdaFunctionName getProgramConfig
gulp lambdaFunctionAll --lambdaFunctionName getProgramList
gulp lambdaFunctionAll --lambdaFunctionName getQuestionnaireConfig
gulp lambdaFunctionAll --lambdaFunctionName getQuestionnaireContentConfig
gulp lambdaFunctionAll --lambdaFunctionName getRiskLevels
gulp lambdaFunctionAll --lambdaFunctionName getSamesurfKey
gulp lambdaFunctionAll --lambdaFunctionName getSecurity
gulp lambdaFunctionAll --lambdaFunctionName getTransferMoney
gulp lambdaFunctionAll --lambdaFunctionName getGoogleAnalytics
gulp lambdaFunctionAll --lambdaFunctionName getDwpFirmDataByFirmOID
gulp lambdaFunctionAll --lambdaFunctionName createNewUaoOnboardingRecords
gulp lambdaFunctionAll --lambdaFunctionName updateUaoAccountsCategory
gulp lambdaFunctionAll --lambdaFunctionName updateUaoAccountsType
gulp lambdaFunctionAll --lambdaFunctionName updateGoogleAnalytics
gulp lambdaFunctionAll --lambdaFunctionName updateTheme
gulp lambdaFunctionAll --lambdaFunctionName updateCharts
gulp lambdaFunctionAll --lambdaFunctionName updateBillingPlan
gulp lambdaFunctionAll --lambdaFunctionName updateErrorMessageMap
gulp lambdaFunctionAll --lambdaFunctionName updateContent
gulp lambdaFunctionAll --lambdaFunctionName updateHeaderConfig
gulp lambdaFunctionAll --lambdaFunctionName updateProgramList
gulp lambdaFunctionAll --lambdaFunctionName updateQuestionnaireConfig
gulp lambdaFunctionAll --lambdaFunctionName updateQuestionnaireContent
gulp lambdaFunctionAll --lambdaFunctionName updateAppSettings
gulp lambdaFunctionAll --lambdaFunctionName updateRisklevels
gulp lambdaFunctionAll --lambdaFunctionName updateDummy
gulp lambdaFunctionAll --lambdaFunctionName getBrandCMS
gulp lambdaFunctionAll --lambdaFunctionName getCommonCMS

