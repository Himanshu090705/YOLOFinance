import { Request, Response } from "express";
import { User } from "../model/user";
import { ACCESSS_TOKEN_URI, REDIRECT_URI } from "../constants/constants";
import { getAuthorizationURL } from "../helpers/getAuthorizationURL";
import { generateAuthTokens } from "../helpers/generateAuthTokens";

import { AuthRequest } from "../definitions/AuthRequest";

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const isMatch = user.isPasswordCorrect(password);
    if (!isMatch) {
      res.status(401).send({ message: "Invalid credentials" });
      return;
    }

    const { id_token, refreshToken, accessToken } =
      await generateAuthTokens(user);

    res.cookie("id_token", id_token, {
      httpOnly: false,
      secure: false, // set true in prod with HTTPS
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token", accessToken, {
      httpOnly: false,
      secure: false,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function signup(req: Request, res: Response) {
  const { name, email, username, password } = req.body;
  try {
    const doesExists = await User.findOne({ email });
    if (doesExists) {
      res.status(409).send({ message: "User already exists" });
    } else {
      const user = new User({ name, email, password, username });
      const response = await user.save();
      const { id_token, accessToken } = await generateAuthTokens(user);
      if (response) {
        res
          .cookie("id_token", id_token, {
            httpOnly: false, // prevents JS access
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            path: "/",
          })
          .cookie("access_token", accessToken, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            path: "/",
          });
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

  const access_token = {
    token: response?.access_token,
    refresh_token: response?.refresh_token,
    scope: response?.scope,
    id_token: response?.id_token,
  };

  const userInfo = await getOauthUserInfo(access_token?.token as string);

  const username = userInfo.email.split("@")[0];

  try {
    const doesExists = await User.findOne({ email: userInfo.email });
    if (doesExists) {
      const { id_token, accessToken } = await generateAuthTokens(doesExists);
      res
        .cookie("id_token", id_token, {
          httpOnly: false,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: false,
          path: "/",
        })
        .cookie("access_token", accessToken, {
          httpOnly: false,
          maxAge: 24 * 60 * 60 * 1000,
          secure: false,
          path: "/",
        });
      return res.redirect(`${process.env.ORIGIN}/Dashboard`);
    } else {
      const user = new User({
        name: userInfo.name,
        email: userInfo.email,
        username,
        authProvider: "Google",
        avatar: userInfo.picture,
      });

      const { id_token, accessToken } = await generateAuthTokens(user);
      const response1 = await user.save();
      if (response1) {
        res
          .cookie("id_token", id_token, {
            httpOnly: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            path: "/",
          })
          .cookie("access_token", accessToken, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            path: "/",
          });
        return res.redirect(`${process.env.ORIGIN}/Dashboard`);
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
      }
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

export async function userLogout(req: Request, res: Response) {
  try {
    res.clearCookie("id_token", {
      httpOnly: false, // must match your original cookie
      secure: false, // match same as when you set it
      path: "/", // match same path
      sameSite: "lax", // if you used sameSite when setting
    });
    res.status(200).json({ message: "User Logout" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout failed" });
  }
}
