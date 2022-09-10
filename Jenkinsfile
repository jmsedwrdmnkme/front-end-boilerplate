pipeline {
  agent any

  stages {
    stage('Npm install') {
      steps {
        sh 'npm i'
      }
    }
    stage('Gulp build') {
      steps {
        sh 'gulp build'
      }
    }
    stage('Deploy') {
      steps {
        sh 'rm -rf /var/www/front-end-boilerplate/*'
        sh 'mv -v dist/* /var/www/front-end-boilerplate/'
      }
    }
  }
}
