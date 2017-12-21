# coding: utf-8

# In[1]:


import json

data_lu = []
for i in range (1,11):
    p = json.load(open('./weibo_luhan/data'+str(i)+'.json'))
    data_lu.append(p)


# In[2]:


import networkx as nx
G = nx.Graph()


# In[3]:


def read_edge_json(data):
    for i in data["links"]:
        source = i['source'].split('#')[0]
        target = i['target'].split('#')[0]
        G.add_edge(source, target)
        G.node[source]['cnt'] = 0
        G.node[target]['cnt'] = 0
def read_node_json(data):
    for i in data["nodes"]:
        iid = i['id'].split('#')[0]
        if (iid in G.nodes()) and iid != u'root':
            G.node[iid]["userHref"] = i["userHref"]
            G.node[iid]["cnt"] += 1


# In[4]:



for i in data_lu:
    read_edge_json(i)
for i in data_lu:
    read_node_json(i)

G.node['root']['userHref'] = ' '
print nx.info(G)


# In[5]:


def getlayer(graph, source):
    discovered = {}
    parent = {}
    dist = {}
    for i in graph.nodes():
        discovered[i] = False
        parent[i] = None
        dist[i] = 922337203685477580
    q = []
    q.append(source)
    discovered[source] = True
    dist[source] = 0
    graph.node[source]["layer"] = 0
    while q:
        u = q.pop(0)
        graph.node[u]["degree"] = 0
        graph.node[u]["children"] = []
        for v in graph.neighbors(u):
            graph.node[u]["degree"] += 1
            if discovered[v] == False:
                graph.node[u]["children"].append(v)
                discovered[v] = True
                dist[v] = dist[u] + 1
                graph.node[v]["layer"] = dist[v]
                parent[v] = u
                q.append(v)

def save_new(graph, source):
    pass


# In[6]:



getlayer(G,'root')


# In[7]:


cnt = [0] * 5
print len(G.edges())
for i in list(G.nodes()):
    for p in range(1,4):
        if G.node[i]["layer"] == p and len(G.node[i]["children"]) == 0:
            cnt[p] += 1
            if cnt[p] >400:
                G.remove_node(i)
                break
print cnt

layerCnt = [0]*30
for i in G.nodes():
    layerCnt[G.node[i]["layer"]] += 1
print layerCnt

newdata = {
    "nodes" : [],
    "links" : []
}
n_id = 0
for i in G.nodes():
    newdata["nodes"].append({"layer" : G.node[i]["layer"],
                             "degree" : G.node[i]["degree"],
                             "children" : G.node[i]["children"],
                             "userHref" : G.node[i]["userHref"],
                             "cnt" : G.node[i]["cnt"],
                             "name" : i})
    G.node[i]["n_id"] = n_id
    n_id += 1
for (u, v) in G.edges():
    newdata["links"].append({"source" : G.node[u]["n_id"],
                            "target" : G.node[v]["n_id"]})
json.dump(newdata, open('new.json','w'))
