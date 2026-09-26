VALGHARIE — Minecraft Java Edition 26.2

1. Décompresse le dossier.
2. Ouvre index.html dans ton navigateur, ou ouvre le dossier dans VS Code.
3. Pour afficher une vraie image de fond du serveur, place ton image dans:
   assets/valgharie-bg.jpg
4. Le site fonctionne sans serveur pour la démo:
   - profils: Arlexen, , ViewelValghar, Routier87, Le Doc Sensei, N3R0X
   - identifiant par défaut: 2026
   - mot de passe par défaut: 2026
   - modification du profil et du style
   - ajout d'usines
   - consultation des usines des autres
   - salon commun
   - sauvegarde automatique via localStorage

IMPORTANT:
Cette version est un prototype front-end. Pour un vrai site où plusieurs personnes utilisent le même compte depuis des ordinateurs différents, il faudra un backend avec une base de données et une vraie authentification sécurisée.


STATUT SERVEUR MINECRAFT
------------------------
Le site contient maintenant un système de statut live :
- nombre de joueurs actuellement connectés ;
- statut du serveur ;
- chaque profil passe automatiquement en « Connecté » ou « Non connecté » si son pseudo est trouvé dans la liste des joueurs du serveur ;
- vérification toutes les 15 secondes.

Dans config.json et script.js, remplace :
A_REMPLACER_PAR_IP_OU_DOMAINE_DU_SERVEUR

par l'adresse réelle de ton serveur Minecraft Java.

IMPORTANT :
Le site ne peut pas deviner l'adresse réelle du serveur. Le système est prêt, mais l'IP/domaine doit être renseigné.
Si par « RIM » tu voulais dire Minecraft Realms, l'intégration est différente : il faudra utiliser une intégration/backend compatible avec ton Realm plutôt que l'API de statut d'un serveur Java classique.
