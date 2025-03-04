import React from 'react'
import AdminCameraEditForm from './components/AdminCameraEditForm'

function App() {
  // Full hardcoded schema (as provided by your backend)
  const schema = {
    global: {
      eks_cluster_name: "string",
      FPS: "string",
      TRACKING_class_mapping: "string",
      TRACKING_class_categories: "string"
    },
    ASGs: {
      max_c5: "string",
      max_x: "string",
      max_2x: "string"
    },
    kafka_exporter: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string"
    },
    pre_processor: {
      INPUT_MODE: "string",
      INPUT_QUEUE_SIZE: "string",
      RECONNECT_TIMEOUT: "string",
      FRAME_READ_TIMEOUT: "string",
      RTSP_URL: "string",
      KVS_JOB_LABEL: "string",
      KVS_STREAM_ARN_OVERRIDE: "string",
      KVS_START_TIMESTAMP_AUS: "string",
      KVS_END_TIMESTAMP_AUS: "string",
      KVS_ALWAYS_START_FROM_BEGINNING: "string",
      KVS_REGULATED_FPS: "string",
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string"
    },
    privacy_masking: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      S3_URI_ML_MODEL_SEGMENTATION: "string"
    },
    bytetrack: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      confidence_threshold: "string",
      INPUT_image_size_width: "string",
      S3_URI_ML_MODEL_TRACKING: "string",
      MOTION_frame_number: "string",
      MOTION_frame_stride: "string",
      MOTION_motion_thresh: "string",
      MOTION_search_depth: "string",
      MOTION_unseen_track_persistence_sec: "string",
      FILTER_vehicles_outside_roi: "string",
      FILTER_people_in_vehicles: "string",
      FILTER_vehicles_in_vehicle: "string"
    },
    exclusion_zones: {
      MODULE_TYPE: "string",
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      INTERVAL_BETWEEN_EVENT_STORMS: "string"
    },
    heatmaps: {
      MODULE_TYPE: "string",
      HEATMAP_LENGTH_MIN: "string",
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string"
    },
    person_plant_distance: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      INTERVAL_BETWEEN_EVENT_STORMS: "string"
    },
    loose_object_detection: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      UNSEEN_THRESH: "string",
      EXPIRED_THRESH: "string",
      ALERT_TO_UNSEEN_THRES: "string",
      CENTROID_DEVIATION_THRES: "string",
      OBJECT_AREA_DEVIATION_THRESHOLD: "string",
      INPUT_RATE: "string",
      INTERVAL_BETWEEN_EVENT_STORMS: "string"
    },
    post_processor: {
      KVS_STREAM_NAME: "string",
      KVS_STREAM_NAME_RAW: "string",
      KVSSINK_BUILD_FOLDER: "string",
      HLS_CHUNK_DURATION: "string",
      BITRATE_KBPS: "string",
      INPUT_QUEUE_SIZE: "string",
      RECONNECT_TIMEOUT: "string",
      FRAME_READ_TIMEOUT: "string",
      MODULE_TYPE: "string",
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      VISUAL_DEBUG: "string"
    },
    track_aggregator: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      BATCH_SIZE_SEC: "string"
    },
    occupancy_zones: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      INTERVAL_BETWEEN_EVENT_STORMS: "string"
    },
    dirt_loading: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      TRUCK_CLASS_IDS: "string",
      EXCAVATOR_CLASS_IDS: "string",
      UNSEEN_TRUCK_PERSISTENCE_SEC: "string",
      BUCKET_LOCK_SEC: "string",
      TRUCK_LOCK_SEC: "string"
    },
    ml_monitoring: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string"
    },
    number_plate_recognition: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      SQS_QUEUE_URL: "string"
    },
    kvs_exporter: {
      LOGGING_INTERVAL: "string",
      LOG_LEVEL: "string",
      KAFKA_COMMIT_INTERVAL: "string",
      KAFKA_CONSUMER_GROUP: "string",
      INPUT_QUEUE_SIZE: "string",
      RECONNECT_TIMEOUT: "string",
      FRAME_READ_TIMEOUT: "string",
      KVS_STREAM_ARN_OVERRIDE: "string",
      EXPORT_JOB_LABEL: "string",
      EXPORT_START_TIMESTAMP_AUS: "string",
      EXPORT_END_TIMESTAMP_AUS: "string",
      EXPORT_CLIP_INTERVALS: "string",
      EXPORT_DESTINATION_S3_BUCKET_ARN: "string",
      SDSS_EXPORT_ENABLED: "string"
    }
  };

  // Full hardcoded test data (only the "processors" part is used by our form)
  const adminCamera = {
    processors: {
      global: {
        eks_cluster_name: "sd_sightdata_generic_eks-cluster_sdss_npd",
        FPS: "8",
        TRACKING_class_mapping: "{\"0\": \"person\", \"1\": \"car\", \"2\": \"truck\", \"3\": \"forklift\", \"4\": \"loader\", \"5\": \"crane\", \"6\": \"excavator\", \"7\": \"compactor\", \"8\": \"dozer\", \"9\": \"grader\", \"10\": \"driller\", \"11\": \"motorbike\"}",
        TRACKING_class_categories: "{ \"peoples\": [0], \"vehicles\": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }"
      },
      ASGs: {
        max_c5: "1",
        max_x: "1",
        max_2x: "0"
      },
      kafka_exporter: {
        LOGGING_INTERVAL: "1",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "kafka_exporter"
      },
      pre_processor: {
        INPUT_MODE: "RTSP",
        INPUT_QUEUE_SIZE: "128",
        RECONNECT_TIMEOUT: "5",
        FRAME_READ_TIMEOUT: "5",
        RTSP_URL: "rtsp://rtsp-simple-server-service.site-a.svc.cluster.local.:8554/value",
        KVS_JOB_LABEL: "arbitrary_job-id",
        KVS_STREAM_ARN_OVERRIDE: "",
        KVS_START_TIMESTAMP_AUS: "dd/mm/YYYY'T'HH:MM:SS.ffffff",
        KVS_END_TIMESTAMP_AUS: "dd/mm/YYYY'T'HH:MM:SS.ffffff",
        KVS_ALWAYS_START_FROM_BEGINNING: "false",
        KVS_REGULATED_FPS: "8",
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "pre_processor"
      },
      privacy_masking: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "privacy_masking",
        S3_URI_ML_MODEL_SEGMENTATION: "s3://sd-sightdata-mlops-s3-bucket-models-prd/segmentation/yolov8/segmentation-yolov8-v1.0.0.engine"
      },
      bytetrack: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "bytetrack",
        confidence_threshold: "0.5",
        INPUT_image_size_width: "640",
        S3_URI_ML_MODEL_TRACKING: "s3://sd-sightdata-mlops-s3-bucket-models-prd/tracking/yolov8_bytetrack/tracking-yolov8-bt-v2.0.0.engine",
        MOTION_frame_number: "0",
        MOTION_frame_stride: "16",
        MOTION_motion_thresh: "0.7",
        MOTION_search_depth: "2",
        MOTION_unseen_track_persistence_sec: "300",
        FILTER_vehicles_outside_roi: "true",
        FILTER_people_in_vehicles: "true",
        FILTER_vehicles_in_vehicle: "true"
      },
      exclusion_zones: {
        MODULE_TYPE: "persons",
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "exclusion_zones",
        INTERVAL_BETWEEN_EVENT_STORMS: "300"
      },
      heatmaps: {
        MODULE_TYPE: "persons_vehicles",
        HEATMAP_LENGTH_MIN: "240",
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "heatmaps"
      },
      person_plant_distance: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "person_plant_distance",
        INTERVAL_BETWEEN_EVENT_STORMS: "300"
      },
      loose_object_detection: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "loose_object_detection",
        UNSEEN_THRESH: "5",
        EXPIRED_THRESH: "5",
        ALERT_TO_UNSEEN_THRES: "24",
        CENTROID_DEVIATION_THRES: "12",
        OBJECT_AREA_DEVIATION_THRESHOLD: "10",
        INPUT_RATE: "5",
        INTERVAL_BETWEEN_EVENT_STORMS: "300"
      },
      post_processor: {
        KVS_STREAM_NAME: "sd_sightdata_site-a_kvs-stream_c0_npd",
        KVS_STREAM_NAME_RAW: "sd_sightdata_site-a_kvs-stream_c0_npd_raw",
        KVSSINK_BUILD_FOLDER: "/opt/amazon-kinesis-video-streams-producer-sdk-cpp/build",
        HLS_CHUNK_DURATION: "4",
        BITRATE_KBPS: "2048",
        INPUT_QUEUE_SIZE: "128",
        RECONNECT_TIMEOUT: "5",
        FRAME_READ_TIMEOUT: "5",
        MODULE_TYPE: "EZ_PPD",
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "post_processor_plugin",
        VISUAL_DEBUG: "false"
      },
      track_aggregator: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "track_aggregator",
        BATCH_SIZE_SEC: "15"
      },
      occupancy_zones: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "occupancy_zones",
        INTERVAL_BETWEEN_EVENT_STORMS: "300"
      },
      dirt_loading: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "dirt_loading",
        TRUCK_CLASS_IDS: "[2, 14]",
        EXCAVATOR_CLASS_IDS: "[6]",
        UNSEEN_TRUCK_PERSISTENCE_SEC: "300",
        BUCKET_LOCK_SEC: "7",
        TRUCK_LOCK_SEC: "7"
      },
      ml_monitoring: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "ml_monitoring"
      },
      number_plate_recognition: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "number_plate_recognition",
        SQS_QUEUE_URL: "https://sqs.ap-southeast-2.amazonaws.com/409727044388/sd_sightdata_generic_sqs-queue_on-prem-api-c0_npd"
      },
      kvs_exporter: {
        LOGGING_INTERVAL: "2400",
        LOG_LEVEL: "INFO",
        KAFKA_COMMIT_INTERVAL: "1",
        KAFKA_CONSUMER_GROUP: "kvs_exporter",
        INPUT_QUEUE_SIZE: "128",
        RECONNECT_TIMEOUT: "5",
        FRAME_READ_TIMEOUT: "5",
        KVS_STREAM_ARN_OVERRIDE: "",
        EXPORT_JOB_LABEL: "arbitrary_job-id",
        EXPORT_START_TIMESTAMP_AUS: "dd/mm/YYYY'T'HH:MM:SS.ffffff",
        EXPORT_END_TIMESTAMP_AUS: "dd/mm/YYYY'T'HH:MM:SS.ffffff",
        EXPORT_CLIP_INTERVALS: "(1, hours)",
        EXPORT_DESTINATION_S3_BUCKET_ARN: null,
        SDSS_EXPORT_ENABLED: "false"
      }
    }
  };

  const handleSave = (data) => {
    console.log('Saved data:', data);
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Camera Edit Form</h1>
      <AdminCameraEditForm
        newForm={true}
        schema={schema}
        adminCamera={adminCamera}
        onSave={handleSave}
        onCancel={handleCancel}
        errorMsg=""
      />
    </div>
  );
}

export default App;
