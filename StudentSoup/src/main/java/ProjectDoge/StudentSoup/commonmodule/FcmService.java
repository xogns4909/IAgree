package ProjectDoge.StudentSoup.commonmodule;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FcmService {
    private final FirebaseMessaging firebaseMessaging;

    @Autowired
    public FcmService(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    public void sendRestaurantCreationNotification(Long restaurantId, String restaurantName, String schoolName,Long schoolId) {
        // 제목과 본문 설정
        Notification notification = Notification.builder()
                .setTitle("새 음식점 추가 알림")
                .setBody(schoolName + " 주변 " + restaurantName + " 음식점이 추가 되었습니다.")
                .build();

        // 메시지 구성
        Message message = Message.builder()
                .setNotification(notification)
                .putData("restaurantId", restaurantId.toString())
                .putData("restaurantName", restaurantName)
                .setTopic( "school_"+schoolId.toString()) // 해당 토픽에 대한 구독자들에게 메시지를 보냅니다.
                .build();

        // 메시지 전송
        try {
            log.info("알림 전송 메소드가 실행되었습니다.");
            String response = firebaseMessaging.send(message);
        } catch (FirebaseMessagingException e) {
            log.error("알림 전송 실패: ", e);
        }
    }
}