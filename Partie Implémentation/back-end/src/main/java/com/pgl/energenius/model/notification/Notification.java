package com.pgl.energenius.model.notification;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Notification
 */
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Document("notifications")
public class Notification {

    @Id
    @Default
    private ObjectId id = new ObjectId();

    /**
     * The ID of the person who sends the notification
     */
    private ObjectId senderId;

    /**
     * The ID of the person who receives the notification
     */
    private ObjectId receiverId;

    /**
     * The date at which the notification was sent
     */
    @Default
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date = new Date();

    /**
     * The message of the notification
     */
    private Type type;

    @Default
    private Status status = Status.UNREAD;

    public enum Status {
        UNREAD,
        READ
    }

    public enum Type {
        READING_NOTIFICATION,
        CONTRACT_REQUEST_NOTIFICATION,
        ACCEPT_CONTRACT_NOTIFICATION,
        CANCEL_CONTRACT_REQUEST_NOTIFICATION,
        END_CONTRACT_NOTIFICATION,
        CANCEL_CONTRACT_NOTIFICATION,
        LINK_METER_NOTIFICATION,
        UNLINK_METER_NOTIFICATION,
        PRODUCTION_POINT_REQUEST_NOTIFICATION,
        PRODUCTION_POINT_ACCEPTED_NOTIFICATION,
        GREEN_CERTIFICATE_REQUEST_NOTIFICATION,
        GREEN_CERTIFICATE_ACCEPTED_NOTIFICATION
    }
}
