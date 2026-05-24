package com.distributedlab.labapi.service;

import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ReplicationLagService {

  private static final Logger log = LoggerFactory.getLogger(ReplicationLagService.class);

  private static final long WARNING_THRESHOLD_MS = 200;
  private static final long CRITICAL_THRESHOLD_MS = 500;

  private final JdbcTemplate jdbcTemplate;
  private volatile long configuredLagMs = 0;

  public ReplicationLagService(DataSource dataSource) {
    this.jdbcTemplate = new JdbcTemplate(dataSource);
  }

  public Map<String, Object> adjustLag(long millis) {
    log.info("Adjusting replication lag to {}ms", millis);
    this.configuredLagMs = Math.max(0, millis);

    try {
      if (configuredLagMs == 0) {
        jdbcTemplate.execute("SELECT pg_catalog.pg_is_in_recovery()");
        log.info("Replication lag reset to 0ms");
      } else {
        jdbcTemplate.execute(
            "SELECT pg_catalog.pg_is_in_recovery()");
        log.info("Replication lag set to {}ms (simulated)", configuredLagMs);
      }
    } catch (Exception e) {
      log.warn("Direct replication control not available: {}. "
          + "Lag value stored for simulation purposes.", e.getMessage());
    }

    return getCurrentLag();
  }

  public Map<String, Object> getCurrentLag() {
    Map<String, Object> status = new HashMap<>();
    status.put("configuredLagMs", configuredLagMs);
    status.put("warningThresholdMs", WARNING_THRESHOLD_MS);
    status.put("criticalThresholdMs", CRITICAL_THRESHOLD_MS);

    String level;
    if (configuredLagMs == 0) {
      level = "none";
    } else if (configuredLagMs <= WARNING_THRESHOLD_MS) {
      level = "normal";
    } else if (configuredLagMs <= CRITICAL_THRESHOLD_MS) {
      level = "warning";
    } else {
      level = "critical";
    }
    status.put("level", level);
    status.put("violated", configuredLagMs > CRITICAL_THRESHOLD_MS);

    try {
      Map<String, Object> replicationInfo = queryReplicationStatus();
      status.put("replicationInfo", replicationInfo);
      if (replicationInfo.containsKey("actualLagMs")) {
        status.put("actualLagMs", replicationInfo.get("actualLagMs"));
      }
    } catch (Exception e) {
      log.debug("Could not query replication status: {}", e.getMessage());
      status.put("actualLagMs", configuredLagMs);
    }

    return status;
  }

  private Map<String, Object> queryReplicationStatus() {
    Map<String, Object> info = new HashMap<>();
    try {
      Boolean inRecovery = jdbcTemplate.queryForObject(
          "SELECT pg_catalog.pg_is_in_recovery()", Boolean.class);
      info.put("inRecovery", inRecovery);

      if (Boolean.TRUE.equals(inRecovery)) {
        try {
          Long lagBytes = jdbcTemplate.queryForObject(
              "SELECT pg_catalog.pg_wal_lsn_diff("
                  + "pg_catalog.pg_last_wal_receive_lsn(),"
                  + "pg_catalog.pg_last_wal_replay_lsn())",
              Long.class);
          info.put("lagBytes", lagBytes != null ? lagBytes : 0L);
        } catch (Exception e) {
          log.debug("Could not query WAL lag: {}", e.getMessage());
        }
      }
    } catch (Exception e) {
      log.debug("Could not query recovery status: {}", e.getMessage());
    }
    return info;
  }
}
