pipeline {
    agent {label "jenkins-local"}

    environment {
        // ANSIBLE_CONFIG = '/etc/ansible/ansible.cfg'
        // PRIVATE_KEY_PATH = '/etc/ansible/morokey.pem'
        // ANSIBLE_LOCAL_TEMP = '/tmp/ansible_tmp'
        // LOGIN_CREDS = credentials('docker_login_creds')
        // ANSIBLE_PRIVATE_KEY=credentials('SOLO-PRIVATE-KEY') 
        // GO114MODULE = 'on'
        // CGO_ENABLED = 0 
        // GOPATH = "${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_ID}"
        // LOGIN_CREDS = credentials('docker_login_creds')
        // HELM_NAME = "tutor-golang"
        DOCKER_REGISTRY="docker.io"
        DOCKER_CONTAINER="fismed-fe-dev"
        DOCKER_IMAGE="fismed-fe"
        // DOCKER_VERSION=sh (returnStdout: true, script: 'echo v$(./git-buildnumber)').trim()
        // HELM_REPO="oci://registry-1.docker.io/solusik8s"
        // HELM_CHART="steradian"
        // HELM_VERSION="1.0.2"
        // HELM_NS="helm-tutor"
        // HELM_VALUES="value-tutor-golang.yaml"

    }

    stages {

        stage('Initialize GO') {
            steps {
                script {
                        echo "initialize GO"
                        sh 'pwd'
                        sh 'echo "-------------"'
                        sh 'ls -al'
                        sh 'echo "--------------"'
                        sh 'whoami'

                    
                }
            }
        }
        stage("Build Docker image") {
            steps{
                echo "Build image"
                sh 'docker build -t fismed-fe:latest .'
                
            }
        }



        stage("Push Docker Image") {
            steps{
                echo "Push Image"
           
                sh '''
                  docker ps
                  docker stop fismed-fe-dev
                  docker rm fismed-fe-dev
                  docker run -d --name fismed-fe-dev --restart always -p 3000:3000 fismed-fe:latest
                  docker ps
                '''
                
            }
        }

    }

    post {
        always {
            cleanWs()
        }
    }
}