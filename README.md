# ezpz

# Heroku deployment

- brew tap heroku/brew && brew install heroku
- heroku login
- heroku git:remote -a ezpzmr
- git push heroku main

# Setting up api token to make calls to gitlab api locally:

- run `echo $GITLAB_TOKEN` to check it's not set
- Go to gitlab, go to your profile, access tokens
- Create a token, set expiry whatever, make sure it has `read_api` and not write just in case
- run `export GITLAB_TOKEN=<paste the token here>`
- done
