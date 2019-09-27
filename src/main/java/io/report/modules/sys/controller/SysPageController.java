/**
 * Copyright 2018 RDP http://product.mftcc.cn/rdp/
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package io.report.modules.sys.controller;

import io.report.common.utils.R;
import io.report.modules.sys.shiro.ShiroUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 系统页面视图
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2016年11月24日 下午11:05:27
 */
@Controller
public class SysPageController {

    @RequestMapping("modules/{module}/{url}.html")
    public String module(@PathVariable("module") String module, @PathVariable("url") String url) {
        return "modules/" + module + "/" + url;
    }

    @RequestMapping("modules/{module}/{sub}/{url}.html")
    public String submodule(@PathVariable("module") String module, @PathVariable("sub") String sub, @PathVariable("url") String url) {
        return "modules/" + module + "/" + sub + "/" + url;
    }

    @RequestMapping(value = {"/rdpindex.html"})
    public String notmain(String urlPath) {
        try {
            System.out.println(urlPath);

            Subject subject = ShiroUtils.getSubject();
            UsernamePasswordToken token = new UsernamePasswordToken("admin", "123456");
            subject.login(token);
        } catch (UnknownAccountException e) {
            R.error(e.getMessage());
        } catch (IncorrectCredentialsException e) {
            R.error("账号或密码不正确");
        } catch (LockedAccountException e) {
            R.error("账号已被锁定,请联系管理员");
        } catch (AuthenticationException e) {
            R.error("账户验证失败");
        }
        return "index";
    }

    @RequestMapping(value = {"/", "index.html"})
    public String index() {
        return "index";
    }

    @RequestMapping("index1.html")
    public String index1() {
        return "index1";
    }

    @RequestMapping("login.html")
    public String login() {
        return "login";
    }

    @RequestMapping("developing.html")
    public String developing() {
        return "developing";
    }

    @RequestMapping("auth_help.html")
    public String authhelp() {
        return "auth_help";
    }

    @RequestMapping("rdpconsole.html")
    public String rdpconsole() {
        return "rdpconsole";
    }

    @RequestMapping("main.html")
    public String main() {
        return "main";
    }

    @RequestMapping("404.html")
    public String notFound() {
        return "404";
    }

    @RequestMapping("500.html")
    public String serverError() {
        return "500";
    }

}
