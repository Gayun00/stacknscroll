# Share Extension 가이드

## 개요

StackNScroll은 딥링크를 사용하여 다른 앱에서 URL을 공유받을 수 있습니다. 현재는 Expo 관리형 워크플로우에서 지원하는 딥링크 방식을 사용하고 있습니다.

## 딥링크 사용 방법

### URL 스킴
```
stacknscroll://
```

### 링크 공유 URL 형식
```
stacknscroll://?url=https://example.com
```

## iOS에서 사용하기

### 방법 1: Safari에서 공유하기 (북마클릿)

1. Safari에서 북마크 추가
2. 북마크 이름: "StackNScroll에 저장"
3. URL에 다음 JavaScript 입력:
```javascript
javascript:(function(){window.location='stacknscroll://?url='+encodeURIComponent(location.href);})();
```

4. 원하는 페이지에서 북마크를 실행하면 StackNScroll 앱이 열리고 링크가 저장됩니다.

### 방법 2: Shortcuts 앱 사용

1. Shortcuts 앱 열기
2. 새로운 Shortcut 생성
3. "Get URLs from Input" 액션 추가
4. "Open URLs" 액션 추가
5. URL을 다음 형식으로 설정:
```
stacknscroll://?url=[Shortcut Input]
```
6. 공유 시트에 추가

### 방법 3: Native Share Extension (추후 구현)

**현재 Expo 관리형 워크플로우에서는 제한됨. Expo Dev Client나 Bare Workflow가 필요합니다.**

Native Share Extension을 사용하려면:
1. Expo Dev Client 빌드
2. iOS Share Extension 추가
3. Extension에서 딥링크 호출

## Android에서 사용하기

### 방법 1: 브라우저에서 공유

1. Chrome이나 다른 브라우저에서 페이지 열기
2. 공유 버튼 탭
3. "StackNScroll"을 찾아서 선택
4. 링크가 자동으로 저장됩니다

### Android Intent Filter 설정

`app.json`에 다음 설정이 포함되어 있어야 합니다:

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "stacknscroll"
            }
          ],
          "category": [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
    }
  }
}
```

## 작동 방식

### 1. 딥링크 수신
앱이 `stacknscroll://?url=...` 형식의 URL을 받으면:

### 2. URL 파싱
```typescript
const { queryParams } = Linking.parse(url);
const sharedUrl = queryParams?.url;
```

### 3. 링크 미리보기 가져오기
```typescript
const preview = await fetchLinkPreview(sharedUrl);
```

### 4. Firestore에 저장
```typescript
await createLink(user.uid, {
  url: preview.url,
  title: preview.title,
  description: preview.description,
  imageUrl: preview.imageUrl,
  siteName: preview.siteName,
});
```

### 5. 로컬 상태 업데이트
```typescript
addLink(newLink);
```

## 고급 설정 (선택사항)

### Expo Dev Client로 Native Share Extension 구현

**1. Expo Dev Client 설치**
```bash
npx expo install expo-dev-client
```

**2. iOS Share Extension 추가**

`ios/` 디렉토리에서:

```bash
# Xcode에서 프로젝트 열기
cd ios && open *.xcworkspace
```

Target 추가:
- File → New → Target
- Share Extension 선택
- Product Name: "StackNScrollShare"

**3. Share Extension 코드**

`ShareViewController.swift`:
```swift
import UIKit
import Social

class ShareViewController: SLComposeServiceViewController {
    override func isContentValid() -> Bool {
        return true
    }

    override func didSelectPost() {
        if let item = extensionContext?.inputItems.first as? NSExtensionItem {
            if let attachments = item.attachments {
                for attachment in attachments {
                    if attachment.hasItemConformingToTypeIdentifier("public.url") {
                        attachment.loadItem(forTypeIdentifier: "public.url", options: nil) { (url, error) in
                            if let shareURL = url as? URL {
                                let appURL = URL(string: "stacknscroll://?url=\\(shareURL.absoluteString)")!
                                self.openURL(appURL)
                            }
                            self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
                        }
                    }
                }
            }
        }
    }

    override func configurationItems() -> [Any]! {
        return []
    }

    @objc func openURL(_ url: URL) {
        var responder: UIResponder? = self
        while responder != nil {
            if let application = responder as? UIApplication {
                application.open(url, options: [:], completionHandler: nil)
                break
            }
            responder = responder?.next
        }
    }
}
```

**4. Info.plist 설정**

Share Extension의 `Info.plist`에:
```xml
<key>NSExtensionActivationRule</key>
<dict>
    <key>NSExtensionActivationSupportsWebURLWithMaxCount</key>
    <integer>1</integer>
</dict>
```

**5. App Groups 설정 (선택)**

메인 앱과 Extension 간 데이터 공유를 위해:
1. Xcode → Target → Capabilities
2. App Groups 활성화
3. `group.com.stacknscroll.app` 그룹 추가
4. 메인 앱과 Extension 모두 동일한 그룹 사용

## 테스트

### 딥링크 테스트 (iOS)
```bash
xcrun simctl openurl booted "stacknscroll://?url=https://example.com"
```

### 딥링크 테스트 (Android)
```bash
adb shell am start -a android.intent.action.VIEW -d "stacknscroll://?url=https://example.com"
```

## 문제 해결

### 앱이 열리지 않음
1. `app.json`에서 `scheme` 설정 확인
2. 앱 재설치
3. 딥링크 핸들러가 `app/_layout.tsx`에 있는지 확인

### 링크가 저장되지 않음
1. Firebase Functions가 배포되었는지 확인
2. 사용자가 로그인되어 있는지 확인
3. 콘솔에서 에러 로그 확인

### Share Extension이 나타나지 않음 (iOS)
1. Extension이 빌드에 포함되었는지 확인
2. Extension의 `Info.plist` 설정 확인
3. 디바이스 재시작

## 참고 자료

- [Expo Linking](https://docs.expo.dev/guides/linking/)
- [iOS Share Extension](https://developer.apple.com/documentation/uikit/share_extension)
- [Android Intent Filters](https://developer.android.com/guide/components/intents-filters)
- [Expo Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)

## 다음 단계

1. **인증 개선**: 딥링크로 받은 URL을 로그인 전에 저장해두고, 로그인 후 자동 처리
2. **Native Extension**: Expo Dev Client로 빌드하여 Native Share Extension 구현
3. **에러 처리**: 네트워크 에러나 잘못된 URL에 대한 사용자 피드백
4. **오프라인 지원**: 오프라인 상태에서도 URL 저장하고 나중에 동기화
