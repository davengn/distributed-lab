package com.distributedlab.labapi.client;

import eu.rekawek.toxiproxy.Proxy;
import eu.rekawek.toxiproxy.ToxiproxyClient;
import eu.rekawek.toxiproxy.model.ToxicDirection;
import eu.rekawek.toxiproxy.model.toxic.Latency;
import eu.rekawek.toxiproxy.model.toxic.Bandwidth;
import eu.rekawek.toxiproxy.model.toxic.Slicer;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class LabToxiproxyClient {

  private static final Logger log = LoggerFactory.getLogger(LabToxiproxyClient.class);

  private final ToxiproxyClient client;

  public LabToxiproxyClient(
      @Value("${toxiproxy.host}") String host, @Value("${toxiproxy.port}") int port) {
    this.client = new ToxiproxyClient(host, port);
    log.info("Toxiproxy client initialized: {}:{}", host, port);
  }

  public String injectLatency(String upstream, long latencyMs) throws IOException {
    String proxyName = "tpx-" + UUID.randomUUID().toString().substring(0, 8);
    Proxy proxy = client.createProxy(proxyName, "0.0.0.0:" + findFreePort(), upstream);

    proxy.toxics().latency("latency", ToxicDirection.DOWNSTREAM, latencyMs);

    log.info("Injected {}ms latency on proxy {} -> {}", latencyMs, proxyName, upstream);
    return proxyName;
  }

  public String injectPacketLoss(String upstream, float percentage) throws IOException {
    String proxyName = "tpx-" + UUID.randomUUID().toString().substring(0, 8);
    Proxy proxy = client.createProxy(proxyName, "0.0.0.0:" + findFreePort(), upstream);

    proxy.toxics().slicer("slicer", ToxicDirection.DOWNSTREAM, (long) percentage, 0);

    log.info("Injected {}% packet loss on proxy {} -> {}", percentage, proxyName, upstream);
    return proxyName;
  }

  public void removeFault(String proxyName) throws IOException {
    Proxy proxy = client.getProxy(proxyName);
    if (proxy != null) {
      proxy.delete();
      log.info("Removed Toxiproxy proxy: {}", proxyName);
    }
  }

  public boolean isAvailable() {
    try {
      client.getProxies();
      return true;
    } catch (IOException e) {
      return false;
    }
  }

  private int findFreePort() {
    return 15000 + (int) (Math.random() * 5000);
  }
}
