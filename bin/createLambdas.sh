
#!/usr/bin/env bash

echo 'Build and Deploy in Creation mode for Lambda'

gulp build_lambdaFunction --lambdaFunctionName updateAuthorizer
gulp zip_lambdaFunction --lambdaFunctionName updateAuthorizer
gulp create_lambdaFunction --lambdaFunctionName updateAuthorizer
gulp updateFunctionConfiguration --lambdaFunctionName updateAuthorizer

gulp createAndDeploy --lambdaFunctionName getContentManagement
gulp createAndDeploy --lambdaFunctionName apiUpdateAuthorizer
gulp createAndDeploy --lambdaFunctionName updateEnabled
gulp createAndDeploy --lambdaFunctionName updateTheme
gulp createAndDeploy --lambdaFunctionName updateCharts
gulp createAndDeploy --lambdaFunctionName updateBillingPlan
gulp createAndDeploy --lambdaFunctionName updateErrorMessageMap
gulp createAndDeploy --lambdaFunctionName updateContent
gulp createAndDeploy --lambdaFunctionName updateHeaderConfig
gulp createAndDeploy --lambdaFunctionName updateProgramList
gulp createAndDeploy --lambdaFunctionName updateQuestionnaireConfig
gulp createAndDeploy --lambdaFunctionName updateQuestionnaireContent
gulp createAndDeploy --lambdaFunctionName updateAppSettings
gulp createAndDeploy --lambdaFunctionName updateRisklevels
gulp createAndDeploy --lambdaFunctionName updateGoalTypes
gulp createAndDeploy --lambdaFunctionName updateDummy
gulp createAndDeploy --lambdaFunctionName getBrandCMS
gulp createAndDeploy --lambdaFunctionName getCommonCMS



