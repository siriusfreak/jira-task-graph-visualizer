provider "kubernetes" {
    config_path = "~/.kube/config"
    config_context = "microk8s-cluster"
}

data "kubernetes_namespace" "swiss-knife" {
    metadata {
        name = "swiss-knife"
    }
}

resource "kubernetes_service" "swiss-knife-frontend" {
    metadata {
        name = "swiss-knife-frontend"
        namespace = data.kubernetes_namespace.swiss-knife.metadata[0].name
    }

    spec {
        selector = {
            app = "swiss-knife-frontend"
        }

        port {
            port = 80
            target_port = 80
        }
    }
}


resource "kubernetes_ingress_v1" "swiss-knife" {
    metadata {
        name = "swiss-knife-frontend"
        namespace = data.kubernetes_namespace.swiss-knife.metadata[0].name
        annotations = {
            "cert-manager.io/cluster-issuer" = "letsencrypt-prod"
            "acme.cert-manager.io/http01-edit-in-place"    = "false"
        }
    }

    spec {
        ingress_class_name = "nginx-private"
        tls {
            hosts       = ["swiss-knife-frontend.i.siriusfrk.ru"]
            secret_name = "swiss-knife-frontend-i-siriusfrk-ru-tls"
        }

        rule {

            host = "swiss-knife-frontend.i.siriusfrk.ru"
            http {
                path {
                    path = "/"
                    path_type = "Prefix"
                    backend {
                        service {
                            name = kubernetes_service.swiss-knife-frontend.metadata[0].name
                            port {
                                number = kubernetes_service.swiss-knife-frontend.spec[0].port[0].port
                            }
                        }
                    }
                }
            }
        }
    }
}
resource "kubernetes_deployment_v1" "swiss-knife-frontend" {
    metadata {
        name = "swiss-knife-frontend"
        namespace = data.kubernetes_namespace.swiss-knife.metadata[0].name
    }

    spec {
        replicas = 1

        selector {
            match_labels = {
                app = "swiss-knife-frontend"
            }
        }

        template {
            metadata {
                labels = {
                    app = "swiss-knife-frontend"
                }
            }

            spec {
                node_selector = {
                    "node.kubernetes.io/microk8s-worker" = "microk8s-worker"
                }

                container {
                    image = "registry.i.siriusfrk.ru/swiss-knife-frontend:latest"
                    name = "swiss-knife-frontend"
                    image_pull_policy = "Always"
                    port {
                        container_port = 80
                    }
                }
            }
        }
    }
}
