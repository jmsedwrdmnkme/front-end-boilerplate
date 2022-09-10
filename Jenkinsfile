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
        sh 'mv -v dist/* /var/www/front-end-boilerplate/'
      }
    }
  }
}
