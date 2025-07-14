import { Request, Response } from "express";
import { User } from "../model/user";
import { ACCESSS_TOKEN_URI, REDIRECT_URI } from "../constants/constants";
import { getAuthorizationURL } from "../helpers/getAuthorizationURL";
import { generateAuthTokens } from "../helpers/generateAuthTokens";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const response = await User.find({ username, password });
    if (response.length > 0) {
      res.status(200).send({ data: response[0] });
    } else {
      res.status(404).send({ message: "No users found" });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function signup(req: Request, res: Response) {
  const { fullname, email, username, password } = req.body;
  try {
    const doesExists = await User.findOne({ email });
    if (doesExists) {
      res.status(409).send({ message: "User already exists" });
    } else {
      const user = new User({ fullname, email, password, username });
      const response = await user.save();
      const { accessToken, refreshToken, id_token } =
        await generateAuthTokens(user);
      if (response) {
        res.status(201).send({ message: "New User Created" });
      }
    }
  } catch (error) {
    res.send(error);
  }
}

export async function googleOAuth(req: Request, res: Response) {
  const oauthURL = getAuthorizationURL();
  res.redirect(oauthURL);
}

export async function googleOAuthCallback(req: Request, res: Response) {
  const { code } = req.query;
  const response = await getGoogleOauthAccessToken(code as string);

  const accessToken = {
    token: response?.access_token,
    refresh_token: response?.refresh_token,
    scope: response?.scope,
    id_token: response?.id_token,
  };

  const userInfo = await getOauthUserInfo(accessToken?.token as string);

  const username = userInfo.email.split("@")[0];

  try {
    const doesExists = await User.findOne({ email: userInfo.email });
    if (doesExists) {
      return res.redirect(`${process.env.ORIGIN}/signup?error=exists`);
    } else {
      const user = new User({
        fullname: userInfo.name,
        email: userInfo.email,
        username,
        authProvider: "Google",
        accessToken: accessToken?.token,
        refreshToken: accessToken?.refresh_token,
        id_token: accessToken?.id_token,
      });
      const response1 = await user.save();
      if (response1) {
        return res.redirect(
          `${process.env.ORIGIN}/signup?id_token=${accessToken.id_token}`,
        );
      }
    }
  } catch (error) {
    return res.redirect(`${process.env.ORIGIN}/signup?error=server`);
  }
}

async function getOauthUserInfo(token: string) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      },
    );

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function getGoogleOauthAccessToken(code: string) {
  try {
    const response = await fetch(ACCESSS_TOKEN_URI, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `code=${code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.SERVER_URL}/api/users/google-oauth-callback&grant_type=authorization_code`,
      method: "POST",
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
